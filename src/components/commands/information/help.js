const Discord = require("discord.js");
const Hjson = require("hjson");
const fs = require("node:fs").promises;
const path = require("path");
const AdvancedComponentMenu = require("../../../utilities/classes/AdvancedComponentMenu");

let cachedGuide;

module.exports = {
  name: "help",
  description: "Ready to start your journey with Patrol Bot? Heres the best guide you'll ever get.",
  cooldown: 1,
  category: "information",
  aliases: ["how-to", "howto", "guide"],
  usage: "guide",
  run: async (_client, message, _args) => {
    // TODO: Incorperate args into default selectedOption

    if (!cachedGuide) {
      const data = await fs.readFile(path.join(__dirname, "..", "..", "..", "data", "json", "guide.hjson"), "utf-8");
      cachedGuide = await Hjson.parse(data);
    }

    let selectedOption = "mainMenu";
    let selectedMenu = null;

    const prefix = message.prefix || process.env.DEFAULT_PREFIX || "!";

    // prevent angry eslint
    let menu;

    const selectMenu = () => {
      const selectMenuOptions = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(cachedGuide)) {
        selectMenuOptions.push({
          label: value.selectMenuLabel,
          value: key,
          description: value.description,
          emoji: value.emoji,
          default: (selectedOption === key),
        });
      }
      return new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder("Learn more about Patrol Bot!")
            .addOptions(selectMenuOptions),
        );
    };

    const updateComponents = async (returnComponents = false) => {
      const menus = Object.entries(cachedGuide[selectedOption].menus);

      // Update Embed
      let foundEmbed;
      if (selectedMenu != null) {
        foundEmbed = menus.find((m) => m[0] === selectedMenu)[1].embed;
      } else {
        const found = menus.find((m) => m[1].default === true);
        foundEmbed = found[1].embed;
        // eslint-disable-next-line prefer-destructuring
        selectedMenu = found[0];
      }

      const embed = new Discord.MessageEmbed();
      if (foundEmbed?.title) embed.setTitle(foundEmbed.title);
      if (foundEmbed?.description) embed.setDescription(foundEmbed.description.replace(/\\/g, "`").replace(/{prefix}/g, prefix));
      if (foundEmbed?.color) embed.setColor(foundEmbed.color);

      menu.embed = embed;

      // Update buttons
      const buttonRow = new Discord.MessageActionRow();
      // Buttons
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of menus) {
        if (value.component.link) {
          buttonRow.addComponents(
            new Discord.MessageButton()
              .setLabel(value.component.label)
              .setStyle("LINK")
              .setURL(value.component.url),
          );
        } else {
          buttonRow.addComponents(
            new Discord.MessageButton()
              .setLabel(value.component.label)
              .setStyle(value.component.style)
              .setCustomId(key)
              .setDisabled(selectedMenu === key),
          );
        }
      }

      if (returnComponents) {
        return [buttonRow, selectMenu()];
      }
      menu.components = [buttonRow, selectMenu()];

      // update!
      await menu.update();
      return true;
    };

    const handler = async (int) => {
      int.deferUpdate();
      if (int.isSelectMenu()) {
        // Change selected option, reset selected menu to default.
        selectedOption = int.values?.[0];
        selectedMenu = null;
        await updateComponents();
      } else if (int.isButton()) {
        selectedMenu = int.customId;
        await updateComponents();
      }
    };

    const mainMenuEmbed = cachedGuide.mainMenu.menus.mainMenu.embed;
    menu = new AdvancedComponentMenu(message)
      .setDefaultEmbed(
        new Discord.MessageEmbed()
          .setTitle(mainMenuEmbed.title)
          .setDescription(mainMenuEmbed.description.replace(/\\`/g, "`").replace(/{prefix}/g, prefix))
          .setColor(mainMenuEmbed.color),
      )
      .setHandler(handler);

    menu.components = await updateComponents(true);
    await menu.send();
  },
};
