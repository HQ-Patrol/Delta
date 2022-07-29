const { EmbedBuilder } = require("discord.js");

EmbedBuilder.prototype.addDescription = function addDescription(append) {
  this.data.description = `${this.data.description ? this.data.description : ""}\n${append}`;
  return this;
};
