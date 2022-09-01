import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import findByUserId from "../../../database/functions/economy/findUserById";
import { Economy } from "../../../database/models/EconomyModel";
import { IUserItem } from "../../../types/Item";

import { chunk, footer } from "../../../utilities/global";
import sendError from "../../../utilities/sendError";
import ComponentMenu from "../../../utilities/classes/ComponentMenu";

import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "inventory",
  description: "View yours or someone elses inventory",
})
export class BalanceCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription("Show off your backpack!")
        .setDMPermission(false)
        .addUserOption((option) => option
          .setName("target")
          .setDescription("Want to see someone elses inventory?")
          .setRequired(false)),
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const target = interaction.options.getUser("target") || interaction.user;

    if (target.bot) return sendError(interaction, "You didn't possibly just tag a bot 😐");

    const person = await findByUserId(target.id);

    if (!Array.isArray(person.items)) {
      // ! Some users may have this issue due to bad legacy practices
      person.items = [];
      await Economy.updateOne({ id: target.id }, { items: [] });
    }

    // empty inventory
    if (person.items.length === 0) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({ name: `${target.username}'s Inventory 🎒`, iconURL: target.displayAvatarURL() })
            .setDescription("**[Inventory is empty!]**\nVisit the shop by typing `/shop` 🛒")
        ],
      });
    }

    const chunks = chunk(person.items.filter((i) => i.count > 0), 8)
    let page = 1;
    const totalPages = chunks.length;
    const tip = footer();

    const embed = () => new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor({ name: `${target.username}'s Inventory 🎒`, iconURL: target.displayAvatarURL() })
      .setFooter({ text: `➤ Page [${page}/${totalPages}] - ${tip}` })
      // eslint-disable-next-line arrow-body-style
      .setDescription(chunks[page - 1].map((value: IUserItem) => {
        // maybe add special effects to special items
        return `➜ ${value.icon} **${value.name}** ─ **${value.count}**
        \`𝘐𝘵𝘦𝘮 𝘛𝘺𝘱𝘦: ${value.type}\`
        `;
      }).join(""));

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

    menu.options.throttle = 500;
    return menu.send();
  }
}