const { Message, EmbedBuilder } = require("discord.js");
const emojis = require("../../constants/emoji");

Message.prototype.sendError = function sendError(errorMessage) {
  return this.reply({
    embeds: [new EmbedBuilder().setColor("Red").setDescription(`${emojis.exclamation} ${errorMessage}`)],
  });
};
