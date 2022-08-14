const { CommandInteraction, EmbedBuilder } = require("discord.js");
const emojis = require("../../constants/emoji");

CommandInteraction.prototype.sendError = function sendError(errorMessage, errorTitle, ephemeral = true) {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setDescription(`${emojis.exclamation} ${errorMessage}`);

  if (errorTitle) embed.setTitle(errorTitle);

  return this.reply({
    embeds: [embed],
    ephemeral,
  });
};
