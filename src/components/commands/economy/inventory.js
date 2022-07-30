const Discord = require("discord.js");

const EconomyModel = require("../../../database/models/EconomyModel");
const findOneOrCreate = require("../../../database/functions/findOneOrCreate");

const AdvancedComponentMenu = require("../../../utilities/classes/AdvancedComponentMenu");

const text = require("../../../constants/text");

module.exports = {
  name: "inventory",
  description: "Shows your inventory",
  usage: "inventory",
  category: "economy",
  cooldown: 3,
  aliases: ["inv", "bag"],
  example: "https://i.imgur.com/aVbIPxQ.gif",
  run: async (client, message, args) => {
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.author;
    if (!target) target = message.author;

    if (target.bot) return message.sendError("You didn't possibly just tag a bot😐");

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
    );

    if (!Array.isArray(person.items)) {
      // ! Some users may have this issue due to bad legacy practices
      person.items = [];
      await EconomyModel.updateOne({ id: target.id }, { items: [] });
    }

    // empty inventory
    if (person.items.length === 0) {
      return message.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: `${target.username}'s Inventory 🎒`, iconURL: target.displayAvatarURL() })
            .setDescription("**[Inventory is empty!]**")
            .addDescription(`Visit the shop by typing \`${message.guildData.prefix || process.env.DEFAULT_PREFIX}shop\` 🛒`),
        ],
      });
    }

    const chunks = client.utils.chunk(person.items, 8);
    let page = 1;
    const totalPages = chunks.length;
    const tip = text.footer[client.utils.rnd(0, text.footer.length - 1)];

    const embed = () => new Discord.EmbedBuilder()
      .setColor("Random")
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
    const menu = new AdvancedComponentMenu(message, message.member)
      .setDefaultEmbed(embed())
      .setComponents(components())
      .setHandler((interaction) => {
        interaction.deferUpdate();
        switch (interaction.customId) {
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
  },
};
