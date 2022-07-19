/**
 * This file contains a class which helps creating prompts with buttons.
*/

const { ActionRowBuilder } = require("discord.js");

/** @class */
class BasicButtonPrompt {
  /** @constructor */
  constructor(message, target) {
    this.Message = message;

    // Other variables
    this.target = target;
    this.PromptMessage = null;
    this.embed = null;
    this.locale = {
      confirm: `<@${target.id}> has confirmed!`,
      deny: `<@${target.id}> has politely denied!`,
    };
    this.time = 30_000;
    this.components = [];
  }

  /**
   * Sets the components row
   * @param {ActionRowBuilder} row row of components
   * @returns {BasicButtonPrompt}
   */
  setComponentRow(row) {
    this.components = [row];
    return this;
  }

  /**
   * Sets the embed
   * @param {EmbedBuilder} embed embed
   * @returns {BasicButtonPrompt}
   */
  setEmbed(embed) {
    this.embed = embed;
    return this;
  }

  async send() {
    if (this.PromptMessage) return new Error("There is already a prompt message!");
    if (this.embed) return new Error("You did not provide an embed!");

    const message = await this.Message.channel.send({
      embeds: [this.embed],
      components: this.components,
    });

    const filter = (interaction) => interaction.customId === "button" && interaction.user.id === this.target;
    const response = await message.awaitMessageComponent({ filter, time: this.time })
      .then((i) => i.customId)
      .catch(() => null);

    if (!response || response === "deny") return false;
    return true;
  }
}

module.exports = BasicButtonPrompt;
