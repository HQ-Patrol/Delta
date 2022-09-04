import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { findItem } from "../../../utilities/query/item";
import sendError from "../../../utilities/sendError";
import { YesNoPrompt } from "../../../utilities/prompt/YesNoPrompt";
import { addItemToUser } from "../../../utilities/query/inventory";

import findByUserId from "../../../database/functions/economy/findUserById";
import { Economy } from "../../../database/models/EconomyModel";

import emoji from "../../../constants/emoji";

// TODO: Autocomplete (but 25 item limit, choose most popular by introducing weight?)
@ApplyOptions<Command.Options>({
  name: "buy",
  description: "Buy an item with your hard earnt coins!",
})
export class BuyCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
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
            .setDescription("What quantity of this item do you want to buy?")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const item = interaction.options.getString("item", true).toLowerCase();
    const quantity = interaction.options.getInteger("quantity", true);

    // Verify item
    const itemFind = findItem(item);
    if (!itemFind)
      return sendError(interaction, "Please provide a valid item name!");
    if (!itemFind.data.canBeBought)
      return sendError(interaction, "You cannot buy this item!");
    if (!itemFind.price)
      return sendError(
        interaction,
        "This item doesn't have a price... contact support!"
      );

    // Check if user has enough material
    const myself = await findByUserId(interaction.user.id);
    const requiredMoney = itemFind.price * quantity;
    if (requiredMoney > myself.coins)
      return sendError(
        interaction,
        `You do not have enough money in your wallet!\n**x${quantity}** \`${
          itemFind.name
        }\` requires ${emoji.coins}**${requiredMoney}**, so you need ${
          emoji.coins
        }**${requiredMoney - myself.coins}** more.`
      );

    // If buying 20 or more items, display prompt
    if (quantity > 20) {
      const [response, askMessage] = await YesNoPrompt(
        interaction,
        `Are you sure you want to buy **x${quantity}** ${itemFind.icon}\`${itemFind.name}\`?\nThis will cost ${emoji.coins} **${requiredMoney}**`
      );

      if (response === true) {
        await Promise.all([
          Economy.updateOne(
            { id: interaction.user.id },
            { $inc: { coins: -requiredMoney } }
          ),
          addItemToUser(interaction.user.id, itemFind.name, quantity, myself),
        ]);

        return askMessage.edit({
          embeds: [
            new MessageEmbed()
              .setTitle("Buy Successful!")
              .setDescription(
                `You have successfully bought **x${quantity}** ${itemFind.icon} \`${itemFind.name}\` for ${emoji.coins} ${requiredMoney}`
              )
              .setColor("GREEN")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
              }),
          ],
          components: []
        });
      } else if (response === false) {
        // no
        return askMessage.edit({
          content: "Well, looks like you rejected a good offer.",
          components: [],
        });
      } else {
        // timeout
        return askMessage.edit({
          content: "Times up bozo, no item for you!",
          components: [],
        });
      }
    } else {
      // Just buy
      await Promise.all([
        Economy.updateOne(
          { id: interaction.user.id },
          { $inc: { coins: -requiredMoney } }
        ),
        addItemToUser(interaction.user.id, itemFind.name, quantity, myself),
      ]);

      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Buy Successful!")
            .setDescription(
              `You have successfully bought **x${quantity}** ${itemFind.icon} \`${itemFind.name}\` for ${emoji.coins} ${requiredMoney}`
            )
            .setColor("GREEN")
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            }),
        ],
      });
    }
  }
}
