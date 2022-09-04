import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { Economy } from "../../../database/models/EconomyModel";
import findUserById from "../../../database/functions/economy/findUserById";

import { getMaximumCompacity } from "../../../utilities/query/economy";
import sendError from "../../../utilities/sendError";
import { parse } from "../../../utilities/query/economy";

import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "deposit",
  description: "Deposit coins into your bank account.",
})
export class DepositCommand extends Command {
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
    let toDep = parse(amount, myself.coins);

    if (toDep === -1) {
      return sendError(
        interaction,
        `You provided an invalid amount! It must be higher than 0 ${emoji.coins}`
      );
    }

    if (toDep <= 0) {
      return sendError(interaction, "You cannot deposit 0 or less coins 😐");
    }

    if (toDep > myself.coins) {
      return sendError(
        interaction,
        "You cannot deposit more coins than you have!",
        "Cannot deposit more than you have!"
      );
    }

    if (toDep + myself.bank > capacity) {
      // Bank Limit Hit

      // Calculate remaining space if any
      const remaining = capacity - myself.bank;
      if (remaining <= 0) {
        return sendError(
          interaction,
          `You have already exceeded your bank capacity limit of **${capacity}** coins. You cannot deposit any more!`,
          "You may not exceed your bank limits!"
        );
      }

      // Only remaining
      toDep = Math.floor(remaining);
      await Economy.updateOne(
        { id: interaction.user.id },
        { $inc: { coins: -toDep, bank: toDep } }
      );
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Bank Limit Hit‼")
            .setDescription(
              `Deposited **${toDep} coins** to your bank ${emoji.coins}\n⤳ \`ɪɴᴄʀᴇᴀꜱᴇ ʏᴏᴜʀ ʟɪᴍɪᴛ ʙʏ ʟᴇᴠᴇʟɪɴɢ ᴜᴘ!\`📈`
            )
            .setFooter({
              text: `${interaction.user.username}'s Bank: ${
                myself.bank + toDep
              }/${capacity} 🏧`,
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            }),
        ],
      });
    }

    await Economy.updateOne(
      { id: interaction.user.id },
      { $inc: { coins: -toDep, bank: toDep } }
    );

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#00FF00")
          .setDescription(`Deposited **${toDep} coins** to your bank!`)
          .setFooter({
            text: `${interaction.user.username}'s Bank: ${
              myself.bank + toDep
            }/${capacity} 🏧`,
            iconURL: interaction.user.displayAvatarURL({
              dynamic: true,
            }),
          }),
      ],
    });
  }
}
