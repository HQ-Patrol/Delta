const { EmbedBuilder } = require("discord.js");

EmbedBuilder.prototype.addField = function addField(name, value, inline) {
  this.addFields({ name, value, inline });
  return this;
};

EmbedBuilder.prototype.addDescription = function addDescription(append) {
  this.data.description = `${this.data.description ? this.data.description : ""}\n${append}`;
  return this;
};
