import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import findOneOrCreate from "../../../database/functions/findOneOrCreate";
import { EconomyModel, IEconomy } from "../../../database/models/EconomyModel";

import { chunk, footer } from "../../../utilities/global";
import sendError from "../../../utilities/sendError";

@ApplyOptions<Command.Options>({
  name: "balance",
  description: "View your balance or somebody elses balance.",
})
export class PingCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("inventory")
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

    const person = await findOneOrCreate(
      {
        id: target.id,
      },
      {
        id: target.id,
        lastUse: Date.now(),
        coins: 50,
        bank: 0,
        xp: 0,
        level: 1,
        items: [],
        bracket: 1,
      },
      EconomyModel,
    ) as IEconomy;

    if (!Array.isArray(person.items)) {
      // ! Some users may have this issue due to bad legacy practices
      person.items = [];
      await EconomyModel.updateOne({ id: target.id }, { items: [] });
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
      .setDescription(chunks[page - 1].map((item) => {
        // maybe add special effects to special items
        return `➜ ${item.icon} **${item.name}** ─ **${item.count}**
        \`𝘐𝘵𝘦𝘮 𝘛𝘺𝘱𝘦: ${item.type}\`
        `;
      }).join(""));

    const components = () => [new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji(client.e.mostleftArrow)
          .setStyle(1)
          .setDisabled(page === 1)
          .setCustomId("mostleft"),
        new Discord.ButtonBuilder()
          .setEmoji(client.e.leftArrow)
          .setStyle(1)
          .setDisabled(page === 1)
          .setCustomId("left"),
        new Discord.ButtonBuilder()
          .setEmoji(client.e.rightArrow)
          .setStyle(1)
          .setDisabled(page === totalPages)
          .setCustomId("right"),
        new Discord.ButtonBuilder()
          .setEmoji(client.e.mostrightArrow)
          .setStyle(1)
          .setDisabled(page === totalPages)
          .setCustomId("mostright"),
      )];

    // Create new menu
    const menu = new AdvancedComponentMenu(interaction, interaction.member)
      .setDefaultEmbed(embed())
      .setComponents(components())
      .setHandler((int) => {
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

    menu.throttleTime = 500;
    return menu.send();
  }
}