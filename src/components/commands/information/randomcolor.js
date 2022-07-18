const Discord = require("discord.js");

function generate() {
  return "#000000".replace(/0/g, () => (Math.trunc(Math.random() * 16)).toString(16));
}

module.exports = {
  name: "randomcolor",
  description: "Generates a random color hex code. Good for finding a color for roles!",
  cooldown: 1,
  category: "information",
  usage: "randomcolor",
  example: "https://i.imgur.com/czMOcAY.gif",
  run: async (_client, message, _args) => {
    const hex = generate();
    const embed = new Discord.MessageEmbed()
      .setTitle(hex)
      .setColor(hex)
      .setThumbnail(`https://singlecolorimage.com/get/${hex.substring(1)}/150x150`);
    message.reply({ embeds: [embed] });
  },
};
