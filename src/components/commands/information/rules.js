const Discord = require("discord.js");

module.exports = {
  name: "rules",
  category: "information",
  aliases: ["rule"],
  cooldown: 60,
  description: "Shows information about Patrol bot fair-use rules!",
  run: async (client, message, args) => {
    const embed = new Discord.EmbedBuilder()
      .setTitle("🚨 Patrol Bot Fair-use Rules and Guidelines 📜")
      .setDescription(
        "<a:Right:763251259896758282> Everyone is required to follow all Server rules along with Bot rules at all time!",
      )
      .addFields(
        {
          name: "#1 Spamming",
          value: "```Spamming Bot commands in any unfair way possible```",
          inline: true,
        },
        {
          name: "#2 Raiding",
          value: "```Using bot to Raid or create Chaos in any server in any way possible```",
          inline: true,
        },
        {
          name: "#3 Alting",
          value: "```Using more than 1 account for Economy/Event purposes```",
          inline: true,
        },
        {
          name: "#4 Macro-ing",
          value: "```Using Auto-typers, Auto-bots or Scripts of any Shape or Form```",
          inline: true,
        },
        {
          name: "#5 Soliciting Reps/Coins",
          value: "```Don't indule yourself in it 💀```",
          inline: true,
        },
        {
          name: "#6 Trading for IRL/Different Bot Currency",
          value: "```Self-explanatory, don't do that```",
          inline: true,
        },
        {
          name: "#7 Sending TOS-Breaking DMs",
          value: "```Abusing DM Command to send Unsolicited, NSFW, Un-safe or unnecessary DMs```",
          inline: true,
        },
        {
          name: "#8 Promoting Hate",
          value: "```Indulging in any sort of Toxicity, Hate, Homophobia, Xenophobia, Racism, etc IS NOT allowed using Bot```",
          inline: true,
        },
        {
          name: "#9 Scamming",
          value: "```Please don't attempt Duping any User in any Shape or form whatsoever. Please be Morally responsible!```",
          inline: true,
        },
        {
          name: "#10 Abusing Bugs",
          value: "```If you report a bug, depending on the intensity you shall be rewarded beautifully. While on the other hand if you decide to Abuse it, it'll even in Vain 🙂```",
          inline: true,
        },
      )
      .setFooter({
        text: "➤ Contact @Sinless#0001 for Any other Issues! 📬",
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    return message.author
      .send({ embeds: [embed] })
      .then(() => message.reply(
        "⚖ Please Check your DMs for the list of all Bot Rules! 📜",
      ))
      .catch(() => message.channel.send(
        "`Unlucky! You have DM's closed` <:sus:715633189871419554> Please turn them on 🎇",
      ));
  },
};
