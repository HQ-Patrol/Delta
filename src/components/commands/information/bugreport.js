const Discord = require("discord.js");

module.exports = {
  name: "bugreport",
  description: "Report a bug to the HQ Development Team.",
  category: "information",
  cooldown: 30,
  aliases: ["reportbug"],
  run: async (client, message, args) => {
    const bug = args.join(" ");
    if (!bug) {
      return message.channel.send(
        "Hey, Erica here. What's the issue you had with the bot?",
      );
    }

    const embed = new Discord.MessageEmbed()
      .setTitle("New Bug 🐛")
      .setDescription(`${message.author.tag} ID: ${message.author.id}\n${bug}`)
      .setTimestamp()
      .setFooter({ text: `${message.guild.name}-[${message.guild.id}]` });

    // Send via sharder
    client.cluster.broadcastEval(
      `this.channels.cache.get("784116864686096385")?.send({ embeds: [${JSON.stringify(
        embed,
      )}] }).catch(e => console.log(e))`,
    );

    return message.channel.send("Thanks for reporting the 🐛! Our staff members will get back to you shortly.");
  },
};
