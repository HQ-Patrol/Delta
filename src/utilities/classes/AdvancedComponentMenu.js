/**
 * This file contains a class which aids the process of creating
 * interaction menus with easy use and handling.
 * @author Leo
 */

const Discord = require("discord.js");

/** @class Main class that includes the menu. */
class AdvancedComponentMenu {
  /**
   * Constructs a new AdvancedComponentMenu.
   * @constructor
   * @param {Discord.Message} message
   * @param {Discord.GuildMember} member
   */
  constructor(message, member) {
    this.setup(message, member);
  }

  /**
   * Initializes the values of the menu.
   * @param {Discord.Message} message
   * @param {Discord.GuildMember} member
   */
  setup(message, member) {
    this.message = message;
    this.member = member ?? message.member;
    this.throttle = {};
    this.handler = null;
    this.embed = null;
    this.components = [];
    this.menuMessage = null;
    this.idle = 40_000;
    this.ended = false;
    this.throttleEnabled = true;
    this.menuEndedMessage = true;
  }

  /**
   * Sets a handler to handle button presses. This is mandatory.
   * @param {Function} func
   * @returns {AdvancedComponentMenu}
   */
  setHandler(func = AdvancedComponentMenu.mandatory("func", "setHandler")) {
    this.handler = func;
    return this;
  }

  /**
   * Sets a handler to handle the ending of the collector.
   * @param {Function} func
   * @returns {AdvancedComponentMenu}
   */
  setEndHandler(
    func = AdvancedComponentMenu.mandatory("func", "setEndHandler"),
  ) {
    this.end = func;
    return this;
  }

  /**
   * Sets the components, should be an array of MessageActionRow.
   * @param {Array<Discord.MessageActionRow>} array
   * @returns {AdvancedComponentMenu}
   */
  setComponents(
    array = AdvancedComponentMenu.mandatory("array", "setComponents"),
  ) {
    this.components = array;
    return this;
  }

  /**
   * Adds the component row to the existing array
   * @param {MessageActionRow | Array<Discord.MessageActionRow>} array
   * @returns {AdvancedComponentMenu}
   */
  addComponentRow(
    load = AdvancedComponentMenu.mandatory("load", "setComponents"),
  ) {
    if (Array.isArray(load)) {
      if (load.every((a) => a instanceof Discord.MessageActionRow)) {
        this.components = this.components.concat(load);
      } else {
        throw new Error("Attempt to add an array with a non MessageActionRow.");
      }
    } else if (load instanceof Discord.MessageActionRow) {
      this.components.push(load);
    } else {
      throw new Error(
        "Attempt to add something neither an array nor MessageActionRow",
      );
    }

    return this;
  }

  /**
   * Sets the idle time for the menu before it emits the end event.
   * @param {Number} time
   * @returns {AdvancedComponentMenu}
   */
  setIdleTime(time = AdvancedComponentMenu.mandatory("time", "setIdleTime")) {
    if (Number.isNaN(time)) {
      throw new Error(
        "Please provide a valid time (in milliseconds) for setIdleTime",
      );
    }
    this.idle = time;
    return this;
  }

  /**
   * Sets the default embed of the menu. Mandatory.
   * @param {Discord.EmbedBuilder} embed
   * @returns {AdvancedComponentMenu}
   */
  setDefaultEmbed(
    embed = AdvancedComponentMenu.mandatory("embed", "setDefaultEmbed"),
  ) {
    if (!(embed instanceof Discord.EmbedBuilder)) {
      throw new Error(
        "Embed provided is not a valid EmbedBuilder in setDefaultEmbed.",
      );
    }
    this.embed = embed;
    return this;
  }

  /**
   * Sends the menu. Requires the default embed, handler and components to be set.
   */
  async send() {
    if (!this.embed || !(this.embed instanceof Discord.EmbedBuilder)) {
      throw new Error(
        "Embed was not provided or is not a valid EmbedBuilder while sending.",
      );
    }
    if (!this.handler) {
      throw new Error("Handler was not provided while sending.");
    }
    if (!this.components || this.components.length === 0) {
      throw new Error("Components was not provided while sending.");
    }
    if (this.menuMessage) throw new Error("This Button Menu is already sent!");

    // Send message.
    this.menuMessage = await this.message.reply({
      embeds: [this.embed],
      components: this.components,
    });

    // Create listener.
    return this.listen();
  }

  /**
   * Updates the menu with the correct embed and components.
   */
  async update() {
    if (this.menuMessage === undefined) {
      throw new Error(
        "Attempt to update the MenuMessage while the menu is not sent.",
      );
    }
    if (this.menuMessage === null) return;
    const editPayload = {
      embeds: [this.embed],
      components: this.components,
    };
    if (this.ended && this.menuEndedMessage) {
      editPayload.content = "This menu has expired and is no longer valid!";
    }
    await this.menuMessage.edit(editPayload);
  }

  /**
   * Creates a listener that handles the menu. Should only be used inside the class.
   */
  listen() {
    const filter = (interaction) => {
      if (
        this.components
          .map((a) => a.components.map((b) => b.customId))
          .flat()
          .includes(interaction.customId)
        && interaction.user.id === this.member.id
      ) {
        return true;
      }

      interaction.reply({
        content: "This menu is not for you.",
        ephemeral: true,
      });
      return false;
    };

    // Create component collector.
    this.collector = this.menuMessage.createMessageComponentCollector({
      filter,
      idle: this.idle,
      errors: ["idle"],
    });
    this.collector.on("collect", (interaction) => this.handle(interaction));
    this.collector.on("end", async (_, r) => {
      // Disable buttons
      this.components.forEach((a) => a.components.forEach((b) => b.setDisabled(true)));
      this.ended = true;
      await this.update();
      if (this.end) await this.end(r);
    });
  }

  /**
   * Function called by the collector to handle interactions.
   * @param {Discord.Interaction} interaction Interaction provided
   * @returns {Promise<void>}
   */
  async handle(interaction) {
    if (this.throttleEnabled && !this.checkThrottle(interaction)) return;
    this.handler(interaction);
  }

  /**
   * Checks if the user can execute the interaction, to prevent spamming.
   * @param {Discord.Interaction} interaction Interaction provided.
   * @returns {Boolean} True if allowed, false if not allowed.
   */
  checkThrottle(interaction) {
    if (
      this.throttle[interaction.customId]
      && Date.now() - this.throttle[interaction.customId] < 1000
    ) {
      return false;
    }

    this.throttle[interaction.customId] = Date.now();
    return true;
  }

  /**
   * Stops the collector and deletes the menu.
   * @returns {boolean}
   */
  abort() {
    this.collector.stop();
    this.menuMessage = null;
    return true;
  }

  /**
   * Function to be called as a mandatory argument of a function.
   * @param {String} property
   * @param {String} funcName
   */
  static mandatory(property, funcName) {
    throw new Error(
      `Argument ${property} is mandatory in function ${funcName}.`,
    );
  }
}

module.exports = AdvancedComponentMenu;
