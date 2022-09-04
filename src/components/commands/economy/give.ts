import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import findUserById from "../../../database/functions/economy/findUserById";

import {
  removeItemFromUser,
  addItemToUser,
} from "../../../utilities/query/inventory";
import sendError from "../../../utilities/sendError";
import { findItem } from "../../../utilities/query/item";

import { IItem } from "../../../types/Item";

@ApplyOptions<Command.Options>({
  name: "give",
  description: "Give items to each other!",
})
export class GiveCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Who do you want to give your item(s) to?")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription(
              "Item name (case insensitive), supports aliases (e.g mb1 for Mystery Box 1)"
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("quantity")
            .setMinValue(1)
            .setDescription(
              "What quantity of this item do you want to give to this user?"
            )
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const target = interaction.options.getUser("target", true);
    const item = interaction.options.getString("item", true);
    const quantity = interaction.options.getInteger("quantity", true);

    if (target.bot)
      return sendError(interaction, "You can't send items to a robot...");
    if (target.id === interaction.user.id) {
      return sendError(
        interaction,
        "Sending items to yourself? We don't do that here."
      );
    }

    // Verify item
    const itemFind = findItem(item.toLowerCase()) as IItem;
    if (!itemFind)
      return sendError(
        interaction,
        "Please provide a valid item name or alias!"
      );
    if (!itemFind.data.canBeTraded)
      return sendError(interaction, "This item cannot be traded.");

    const user = await findUserById(interaction.user.id);
    const find = user.items.find((i) => i.name === itemFind.name);
    if (!find || find.count < quantity) {
      return sendError(
        interaction,
        `You do not have enough ${itemFind.icon} **${
          itemFind.name
        }**! You need **${quantity - (find?.count || 0)}** more.`
      );
    }

    await Promise.all([
      removeItemFromUser(interaction.user.id, itemFind.name, quantity, user),
      addItemToUser(target.id, itemFind.name, quantity),
    ]);

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.username} → ${target.username}`,
          })
          .setDescription(
            `You have successfully given ${target} \`x${quantity}\` ${itemFind.icon} **${itemFind.name}**.`
          )
          .setColor("GREEN")
          .setTimestamp(),
      ],
    });
  }
}
