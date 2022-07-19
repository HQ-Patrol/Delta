const Discord = require("discord.js");

module.exports = {
  name: "invite",
  category: "information",
  description: "Provides a link to invite the bot to your server :)",
  cooldown: 1,
  run: async (_client, message, _args) => {
    const embed = new Discord.EmbedBuilder()
      .setThumbnail("https://i.imgur.com/ab2g21s.gif")
      .setTitle("Do you enjoy using Patrol Bot?")
      .setColor("Blue")
      .setDescription("👉 [**Click here to Invite Erica to your server**](https://discord.com/api/oauth2/authorize?client_id=763506280421392466&permissions=8&scope=bot) <a:PatrolBot:736282237225533571>\n"
            + "👉 [**Click here to Invite Veronica to your server**](https://discord.com/api/oauth2/authorize?client_id=943115378349993984&permissions=414467870272&scope=bot) <:Veronica:943463957300146176>\n"
            + "👉 [**Click here to Join Support Server**](https://discord.gg/HQ) <a:HGIcon:774666165262745641>");

    return message.channel.send({ embeds: [embed] });
  },
};
