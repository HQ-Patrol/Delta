const { EmbedBuilder } = require("discord.js");

EmbedBuilder.prototype.addField = function addField(name, value, inline) {
  this.addFields({ name, value, inline });
  return this;
};
