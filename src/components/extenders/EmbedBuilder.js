const { EmbedBuilder } = require("discord.js");
const emojis = require("../../constants/emoji");

EmbedBuilder.prototype.addDescription = function addDescription(append) {
  this.data.description = `${this.data.description ? this.data.description : ""}\n${append}`;
  return this;
};

const templateRegex = /{(\d)}/g;
EmbedBuilder.prototype.setDescription = function setDescriptionPromised(desc, ...placeholders) {
  if (!desc.match(templateRegex)) {
    this.data.description = desc;
  } else {
    this.descriptionPromised = desc;
    this.data.description = desc.replace(templateRegex, (_, i) => placeholders[i] || emojis.loading);
  }
  return this;
};

EmbedBuilder.prototype.setDescriptionFinished = function setDescriptionFinished(...reps) {
  this.data.description = this.descriptionPromised.replace(templateRegex, (_, i) => reps[i] || "?");
  return this;
};
