const Discord = require("discord.js");

const EconomyModel = require("../../../database/models/EconomyModel");
const findOneOrCreate = require("../../../database/functions/findOneOrCreate");

const { getMaximumCompacity } = require("../../../utilities/query/economy");

module.exports = {
  name: "balance",
  description: "Checks your balance",
  usage: "balance <@someone>",
  category: "economy",
  cooldown: 1,
  aliases: ["bal", "wallet"],
  run: async (client, message, args) => {
    let user = message.author;
    const mention = message.mentions.users.first()
      || message.guild.members.cache.get(args[0])?.user;
    if (mention?.id) user = mention;

    if (user.bot) return message.sendError("Bots are way too rich!");

    const person = await findOneOrCreate(
      {
        id: user.id,
      },
      {
        id: user.id,
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

    const capacity = getMaximumCompacity(person);

    if (message.author.id === "735281000044691509") {
      return message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("Random")
            .addFields(
              {
                name: `${client.e.wallet} Wallet:`,
                value: `${client.e.gunshot} ${client.e.coins}`,
                inline: true,
              },
              {
                name: "🏧 Bank:",
                value: `${client.e.gunshot} ${client.e.coins}`,
                inline: true,
              },
            )
            .setAuthor({
              name: `${user.username}'s Balance 💰`,
              iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail("https://i.imgur.com/fYOtU81.gif")
            .setFooter({ text: "Mind your own Bread..." }),
        ],
      });
    }

    return message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("Random")
          .addFields(
            {
              name: `${client.e.wallet} Wallet:`,
              value: `${person.coins} ${client.e.coins}`,
              inline: true,
            },
            {
              name: "🏧 Bank:",
              value: `${person.bank}/**${capacity}** ${client.e.coins}`,
              inline: true,
            },
          )
          .setAuthor({
            name: `${user.username}'s Balance 💰`,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail("https://i.imgur.com/fYOtU81.gif")
          .setFooter({ text: "➤ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ 🥶" })
          .setTimestamp(),
      ],
    });
  },
};

module.exports.slash = {
  data: new Discord.SlashCommandBuilder()
    .setName("balance")
    .setDescription("View your balance or somebody elses balance.")
    .setDMPermission(false)
    .addUserOption((option) => option
      .setName("user")
      .setDescription("Want to peek into somebody elses wallet?")
      .setRequired(false)),
  async handler(client, interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    if (user.bot) return interaction.sendError("Bots are way too rich!");

    const person = await findOneOrCreate(
      {
        id: user.id,
      },
      {
        id: user.id,
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

    const capacity = getMaximumCompacity(person);

    if (user.id === "735281000044691509") {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("Random")
            .addFields(
              {
                name: `${client.e.wallet} Wallet:`,
                value: `${client.e.gunshot} ${client.e.coins}`,
                inline: true,
              },
              {
                name: "🏧 Bank:",
                value: `${client.e.gunshot} ${client.e.coins}`,
                inline: true,
              },
            )
            .setAuthor({
              name: `${user.username}'s Balance 💰`,
              iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail("https://i.imgur.com/fYOtU81.gif")
            .setFooter({ text: "Mind your own Bread..." }),
        ],
      });
    }

    return interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("Random")
          .addFields(
            {
              name: `${client.e.wallet} Wallet:`,
              value: `${person.coins} ${client.e.coins}`,
              inline: true,
            },
            {
              name: "🏧 Bank:",
              value: `${person.bank}/**${capacity}** ${client.e.coins}`,
              inline: true,
            },
          )
          .setAuthor({
            name: `${user.username}'s Balance 💰`,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail("https://i.imgur.com/fYOtU81.gif")
          .setFooter({ text: "➤ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ 🥶" })
          .setTimestamp(),
      ],
    });
  },
};
