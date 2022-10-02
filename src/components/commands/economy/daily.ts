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
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const Cooldowns = (await findOneOrCreate(
      { id: interaction.user.id },
      { id: interaction.user.id },
      CooldownsModel
    )) as ICooldowns;

    if(!Cooldowns.daily) Cooldowns.daily = { days: 0, last: 0 };

    const lastDaily = Cooldowns.daily.last ?? -1;
    if (Date.now() - lastDaily < DAILY_COOLDOWN) {
      // Cooldown
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            // .setAuthor({
            //   name: "ALREADY claimed your Daily Reward ‼",
            //   iconURL: interaction.user.displayAvatarURL(),
            // })
            .setDescription(
              `<a:RedTick:736282199258824774> **|** Please wait for **${prettyMs(lastDaily + DAILY_COOLDOWN - Date.now(), { verbose: true })}** before claiming your Daily reward again <a:exclamation:741988026296696872>`
            )
            .setFooter({ text: `➤ Type: /vote for more Special Rewards! 🎁` })
            .setColor("#FFFF00"),
        ],
      });
    }

    const UserData = (await findOneOrCreate(
      { id: interaction.user.id },
      { id: interaction.user.id },
      User
    )) as IUser;
    let COINS = 1000 + Cooldowns.daily.days * 375;
    let newStreak = Cooldowns.daily.days + 1;

    let messageContent = null;

    if (UserData.premium) {
      messageContent =
        `**You received DOUBLE COINS for being a Patrol Bot Premium User** ${emoji.coins}`;
      // coins x2
      COINS *= 2;
    }

    if (
      Date.now() > lastDaily + STREAK_EXPIRE &&
      lastDaily !== -1
    ) {
      // Lost
      if(Cooldowns.daily.days > 10) messageContent = `__**LOST**__ your ***${Cooldowns.daily.days}*** Days Streak.. <:WAH:740257222344310805>`;
      newStreak = 1;
    }
    
    let description = `<a:GreenTick:736282149094949096> **|** You received **${COINS} Coins** with a daily streak of ${newStreak} <:StackOfCoins:775104542530338822>\n`
    //description += `👉 Claim again in: **${prettyMs(DAILY_COOLDOWN, { verbose: true })}**`;
    //description += "`Type: /vote for more Special Rewards!` ";

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
          daily: {
            days: newStreak,
            last: Date.now(),
          },
        },
      }
    );

    const embed = new MessageEmbed()
      .setAuthor({
        name: "Daily Reward 💹",
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(description)
      .setFooter({ text: `➤ Type: /vote for more Special Rewards! 🎁` })
      //.setTimestamp()
      .setColor("RANDOM");

    return interaction.reply({
      embeds: [embed],
      content: messageContent,
    });
  }
}
