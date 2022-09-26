import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { IItem } from "../../../types/Item";

import { chunk } from "../../../utilities/global";
import ComponentMenu from "../../../utilities/classes/ComponentMenu";

import { items } from "../../../data/json/items.json";

import emoji from "../../../constants/emoji";

const FILTERED_ITEMS = items.filter(i => i.data.canBeBought).sort((a, b) => (a as IItem).price - (b as IItem).price);

@ApplyOptions<Command.Options>({
  name: "shop",
  description: "View the Patrol Bot shop!",
})
export class ShopCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const chunks = chunk(FILTERED_ITEMS, 7);
    let page = 1;
    const totalPages = chunks.length;

    const embed = () => new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor({ name: `Patrol Bot Shop 🛒` })
      .setFooter({ text: `➤ Page [${page}/${totalPages}]` })
      // eslint-disable-next-line arrow-body-style
      .setDescription(
        "Navigate through pages to look at items and use `/buy` to purchase the item you want! 🛍\n\n" +
        chunks[page - 1].map((value: IItem) => `➜ ${value.icon} __**${value.name}**__ ─ **${value.price}** ${emoji.coins} **|** \`𝘐𝘵𝘦𝘮 𝘛𝘺𝘱𝘦: ${value.type}\`\n${value.description}\n\n`).join(""));

    const components = () => [new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setEmoji(emoji.mostleftArrow)
          .setStyle(1)
          .setDisabled(page === 1)
          .setCustomId("mostleft"),
        new MessageButton()
          .setEmoji(emoji.leftArrow)
          .setStyle(1)
          .setDisabled(page === 1)
          .setCustomId("left"),
        new MessageButton()
          .setEmoji(emoji.rightArrow)
          .setStyle(1)
          .setDisabled(page === totalPages)
          .setCustomId("right"),
        new MessageButton()
          .setEmoji(emoji.mostrightArrow)
          .setStyle(1)
          .setDisabled(page === totalPages)
          .setCustomId("mostright"),
      )];

    // Create new menu
    const menu = new ComponentMenu(interaction)
      .whitelist(interaction.user.id)
      .setEmbed(embed())
      .setComponents(components())
      .listen((int: ButtonInteraction) => {
        int.deferUpdate();
        switch (int.customId) {
        case "mostleft":
          page = 1;
          break;
        case "left":
          if (page !== 0) page -= 1;
          break;
        case "right":
          if (page !== totalPages) page += 1;
          break;
        case "mostright":
          page = totalPages;
          break;
        default:
          break;
        }
        menu.embed = embed();
        menu.components = components();
        menu.update();
      });

    return menu.send();
  }
}