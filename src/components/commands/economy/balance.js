const Discord = require("discord.js");

const Economy = require("../../../database/models/EconomyModel");
const findOneOrCreate = require("../../../database/functions/findOneOrCreate");

const { getMaximumCompacity } = require("../../../utilities/query/economy");

module.exports = {
  name: "balance",
  description: "Checks your balance",
  usage: "balance <@someone>",
  category: "economy",
  cooldown: 1,
  aliases: ["bal", "wallet"],
  run: async (_client, message, args) => {
    let user = message.author;
    const mention = message.mentions.users.first()
      || message.guild.members.cache.get(args[0])?.user;
    if (mention?.id) user = mention;

    if (user.bot) return message.reply("Bots are way too rich!");

    const person = await findOneOrCreate(
      {
        id: user.id,
      },
      {
        id: user.id,
        lastUse: Date.now(),
        coins: 250,
        bank: 0,
        xp: 0,
        level: 1,
        items: [],
        bracket: 1,
      },
      Economy,
    );

    const capacity = getMaximumCompacity(person);

    if (message.author.id === "735281000044691509") {
      return message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("Random")
            .addField("<:Wallet:775651665553915904> Wallet:", "<:GUNSHOT:745729904334733392> <a:Coins:775714101564276756>", true)
            .addField("🏧 Bank:", "<:GUNSHOT:745729904334733392> <a:Coins:775714101564276756>", true)
            .setAuthor({ name: `${user.username}'s Balance 💰`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail("https://i.imgur.com/fYOtU81.gif")
            .setFooter({ text: "Mind your own Bread..." }),
        ],
      });
    }

    return message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("Random")
          .addField("<:Wallet:775651665553915904> Wallet:", `${person.coins} <a:Coins:775714101564276756>`, true)
          .addField("🏧 Bank:", `${person.bank}/**${capacity}** <a:Coins:775714101564276756>`, true)
          .setAuthor({ name: `${user.username}'s Balance 💰`, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail("https://i.imgur.com/fYOtU81.gif")
          .setFooter({ text: "➤ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ 🥶" })
          .setTimestamp(),
      ],
    });
  },
};
