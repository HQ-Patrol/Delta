import { ApplyOptions } from "@sapphire/decorators";
import { Command, ChatInputCommand } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

import ms from "ms";
import prettyMs from "pretty-ms";

import { Economy } from "../../../database/models/EconomyModel";
import { User, IUser } from "../../../database/models/UserModel";
import {
  CooldownsModel,
  ICooldowns,
} from "../../../database/models/CooldownsModel";
import findOneOrCreate from "../../../database/functions/findOneOrCreate";

import { items } from "../../../data/json/items.json";
import { addItemsToUser } from "../../../utilities/query/inventory";
import { inRange } from "../../../utilities/global";

import emoji from "../../../constants/emoji";



const rewards: Record<number, Record<string, number>> = {
  10: {
    "Mystery Box 1": 1,
    Cookie: 1,
  },
  25: {
    "Soft Boiled Egg": 1,
    Cookie: 1,
  },
  50: {
    "Soft Boiled Egg": 1,
    "Mystery Box 1": 1,
  },
  75: {
    "Mystery Box 2": 1,
    Cookie: 1,
  },
  100: {
    "Mystery Box 2": 1,
    "Soft Boiled Egg": 1,
  },
  150: {
    "Mystery Box 2": 2,
    "Soft Boiled Egg": 2,
  },
  200: {
    "Mystery Box 3": 1,
    Cookie: 1,
  },
  250: {
    "Mystery Box 3": 2,
    Cookie: 1,
  },
  365: {
    "Mystery Box 3": 2,
    "Medium Boiled Egg": 1,
  },
  500: {
    "Mystery Box XXX": 1,
    Cookie: 1,
  },
};

const DAILY_COOLDOWN = ms("20h");
const STREAK_EXPIRE = ms("24h");

@ApplyOptions<Command.Options>({
  name: "daily",
  description: "Claim your daily reward!",
})
export class DailyCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription("View your balance or somebody elses balance.")
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const Cooldowns = (await findOneOrCreate(
      { id: interaction.user.id },
      { id: interaction.user.id },
      CooldownsModel
    )) as ICooldowns;

    const lastVoted = Cooldowns.vote.last;
    if (Date.now() - lastVoted < DAILY_COOLDOWN) {
      // Cooldown
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: "You have already claimed your daily!",
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `${emoji.exclamation}Your next daily reward is in:\n**${prettyMs(lastVoted + DAILY_COOLDOWN - Date.now(), { verbose: true })}**`
            )
            .setTimestamp()
            .setColor("RANDOM"),
        ],
      });
    }

    const UserData = (await findOneOrCreate(
      { _id: interaction.user.id },
      { _id: interaction.user.id },
      User
    )) as IUser;

    let COINS = 1000 + Cooldowns.vote.days * 375;
    let newStreak = (Cooldowns.vote.days ?? 0) + 1;

    let messageContent = "";

    if (UserData.premium) {
      messageContent =
        "**DOUBLE COINS!** Thank you for supporting us and having Patrol Bot Premium.";
      // coins x2
      COINS *= 2;
    }

    if (
      Date.now() > lastVoted + STREAK_EXPIRE &&
      lastVoted !== -1 &&
      Cooldowns.vote.days > 10
    ) {
      // Lost
      messageContent = `You lost your **${Cooldowns.vote.days}** daily streak.. :cry:`;
      newStreak = 1;
    }

    let description = `**${COINS}** ${emoji.coins} has just been added to your wallet!\n`;
    description += "*Get more special rewards by voting or using our **lootboxes**!*\n";
    description += `\n${emoji.exclamation}Your next daily reward is in:\n`;
    description += `**${prettyMs(DAILY_COOLDOWN, { verbose: true })}**`;

    let reward: Record<string, number> = {};
    if (newStreak >= 10) {
      // eligible, find range
      Object.keys(rewards).forEach((e, i, a) => {
        if (
          !reward &&
          inRange(newStreak, parseInt(e), parseInt(a?.[i + 1], 10))
        ) {
          reward = rewards[parseInt(e)];
        }
      });
    }

    if (Object.keys(reward).length !== 0) {
      description += `\n**REWARDS** *(Streak ${newStreak})*:`;
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const r in reward) {
        description +=
          `x${reward[r]} **${r}** ${items.find((a) => a.name === r)?.icon || ""}`;
      }
    }

    // add items
    if (reward) await addItemsToUser(interaction.user.id, reward);
    // add coins
    await Economy.updateOne(
      { id: interaction.user.id },
      { $inc: { coins: COINS } }
    );
    // add streak
    await CooldownsModel.updateOne(
      { id: interaction.user.id },
      {
        $set: {
          vote: {
            days: newStreak,
            last: Date.now(),
          },
        },
      }
    );

    const embed = new MessageEmbed()
      .setAuthor({
        name: "Daily Coins",
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(description)
      .setFooter({ text: `Streak: ${newStreak}` })
      .setTimestamp()
      .setColor("RANDOM");

    return interaction.reply({
      embeds: [embed],
      content: messageContent,
    });
  }
}
