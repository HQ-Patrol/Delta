const { Message, EmbedBuilder } = require("discord.js");
const emojis = require("../../constants/emoji");

Message.prototype.sendError = function sendError(errorMessage, errorTitle) {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setDescription(`${emojis.exclamation} ${errorMessage}`);

  if (errorTitle) embed.setTitle(errorTitle);

  return this.reply({
    embeds: [embed],
  });
};
