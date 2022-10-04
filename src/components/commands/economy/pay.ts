import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import findByUserId from "../../../database/functions/economy/findUserById";
import { Economy } from "../../../database/models/EconomyModel";

import sendError from "../../../utilities/sendError";
import { parse } from "../../../utilities/query/economy";

import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "pay",
  description: "Pay a friend!",
})
export class PayCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Who do you want to pay coins to?")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("amount")
            .setDescription("An integer, an alias (e.g 2k) or 'half'/'max'")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const target = interaction.options.getUser("target", true);
    const amount = interaction.options.getString("amount", true);

    if (target.bot)
      return sendError(interaction, "You can't give money to a robot...");
    if (target.id === interaction.user.id) {
      return sendError(interaction, "We don't give money to ourselves here.");
    }

    const myself = await findByUserId(interaction.user.id);

    if (myself.coins <= 0)
      return sendError(
        interaction,
        "Either you're broke or in debt. Pick a struggle."
      );

    // parse
    const parsedAmount = parse(amount, myself.coins);

    if (parsedAmount === -1) {
      return sendError(
        interaction,
        `You provided an invalid amount! It must be higher than 0 ${emoji.coins}`
      );
    }

    if (parsedAmount <= 0) {
      return sendError(interaction, "You gave them absolutely nothing.");
    }

    if (parsedAmount > myself.coins) {
      return sendError(
        interaction,
        "You do not seem to have enough coins. Here at Patrol Bot, we don't do that.",
        "You're too poor!"
      );
    }

    await Promise.all([
      Economy.updateOne(
        { id: interaction.user.id },
        { $inc: { coins: -parsedAmount } }
      ),
      Economy.updateOne(
        { id: target.id },
        {
          $inc: { coins: parsedAmount }
        },
        { upsert: true }
      ),
    ])

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#FF6700")
          .setDescription(
            `${emoji.coins} | Gave **${parsedAmount} coins** to ${target} <:bet:715633188457676931>`
          ),
      ],
    });

    // TODO: log transaction
  }
}
