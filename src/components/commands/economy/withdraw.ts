import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import findUserById from "../../../database/functions/economy/findUserById";

import { getMaximumCompacity } from "../../../utilities/query/economy";
import sendError from "../../../utilities/sendError";
import { parse } from "../../../utilities/query/economy";

import emoji from "../../../constants/emoji";
import { Economy } from "../../../database/models/EconomyModel";

@ApplyOptions<Command.Options>({
  name: "withdraw",
  description: "Withdraw money from your bank to use or trade.",
})
export class WithdrawCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addStringOption((option) =>
          option
            .setName("amount")
            .setDescription("An integer, an alias (e.g 2k) or 'half'/'max'")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const amount = interaction.options.getString("amount", true);

    const myself = await findUserById(interaction.user.id);

    const capacity = getMaximumCompacity(myself.level, myself.bracket);
    const toWithdraw = parse(amount, myself.bank);

    if (toWithdraw === -1) {
      return sendError(
        interaction,
        `You provided an invalid amount! It must be higher than 0 ${emoji.coins}`
      );
    }

    if (toWithdraw <= 0) {
      return sendError(interaction, "You cannot withdraw 0 or less coins 😐");
    }

    if (toWithdraw > myself.bank) {
      return sendError(
        interaction,
        "You cannot withdraw more coins than you have!",
        "Cannot withdraw more than you have!"
      );
    }

    await Economy.updateOne(
      { id: interaction.user.id },
      { $inc: { coins: toWithdraw, bank: -toWithdraw } }
    );

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(`Withdrew **${toWithdraw} coins** to your wallet!`)
          .setFooter({
            text: `${interaction.user.username}'s Bank: ${
              myself.bank - toWithdraw
            }/${capacity} 🏧`,
            iconURL: interaction.user.displayAvatarURL({
              dynamic: true,
            }),
          }),
      ],
    });
  }
}
