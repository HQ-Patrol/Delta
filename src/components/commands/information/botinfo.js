const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "botinfo",
  category: "information",
  description: "Shows bot informations",
  cooldown: 3,
  aliases: ["boti", "bot"],
  run: async (client, message, _args) => {
    const guildNum = await client.cluster.broadcastEval("this.guilds.cache.size");
    const userNum = await client.cluster.broadcastEval("this.users.cache.size");
    const embed = new EmbedBuilder()
    // .setThumbnail("https://i.imgur.com/gwBwAoj.gif") // Veronica
      .setThumbnail("https://i.imgur.com/BMJpQiX.gif") // Erica
      .setTitle("🤖 Bot Stats 🤖")
      .setColor("Blue")
      .addFields(
        {
          name: "🌐 Servers",
          value: `Serving ${guildNum.reduce((prev, val) => prev + val, 0)} servers.`,
          inline: true,
        },
        {
          name: "👥 Server Users",
          value: `Serving ${userNum.reduce((prev, val) => prev + val, 0)} users.`,
          inline: true,
        },
        {
          name: "President 👔",
          value: "Sinless#0001",
          inline: true,
        },
        {
          name: "⏳ Ping",
          value: `${Math.round(client.ws.ping)}ms`,
          inline: true,
        },
        {
          name: "📆 Join Date",
          value: client.user.createdAt.toGMTString(),
          inline: true,
        },
        {
          name: "🤓 Contributors",
          value: "Zihad#5252🐐\nleo.#2022🦁\nRageous#7834💲\nDebelox#7000😈 & more...",
          inline: true,
        },
        {
          name: `${client.e.cleanWoman} Invite this Bot`,
          value: "[Click Here](https://discord.com/api/oauth2/authorize?client_id=763506280421392466&permissions=8&scope=bot)",
          inline: true,
        },
        {
          name: `${client.e.patrolBotThug} Website`,
          value: "[Click here to Visit](https://patrolbot.xyz)",
          inline: true,
        },
      )
      .addFields(`${client.e.discordLogo} Discord`, "[Join Server](https://discord.gg/HQ)", true)
      .setFooter({ text: "ID: 711628700747300864 • PFP by: ？？？#0013", iconURL: "https://i.imgur.com/YTMhQOx.gif" })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
