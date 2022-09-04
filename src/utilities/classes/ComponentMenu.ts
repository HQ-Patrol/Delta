/**
 * Want to create easy component menus?
 * @author leo
 */

import {
  CommandInteraction,
  Interaction,
  Message,
  MessageActionRow,
  MessageEditOptions,
  MessageEmbed,
} from "discord.js";

interface ComponentMenuOptions {
  idle: number;
  throttle: boolean | number;
  silentDisable: boolean;
  ephemeral: boolean;
}

// TODO: implement throttle, although might not be needed 
export default class ComponentMenu {
  public interaction?: CommandInteraction;
  public embed?: MessageEmbed;
  public components: MessageActionRow[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public trigger?: (interaction: any) => void;
  public endTrigger?: (reason: string) => void;

  public whitelisted: string[] = [];
  
  public menuMessage?: Message;

  public ended = false;
  public lastClicked = -1;
  
  public options: ComponentMenuOptions = { 
    idle: 40_000,
    throttle: 1000,
    silentDisable: false,
    ephemeral: false,
  };

  constructor(interaction: CommandInteraction, options?: ComponentMenuOptions) {
    if(options) this.options = options;

    this.interaction = interaction;
  }

  public setEmbed(embed: typeof this.embed) {
    this.embed = embed;
    return this;
  }

  public setComponents(components: typeof this.components) {
    this.components = components;
    return this;
  }

  public listen(trigger: typeof this.trigger) {
    this.trigger = trigger;
    return this;
  }

  public endListen(trigger: typeof this.endTrigger) {
    this.endTrigger = trigger;
    return this;
  }

  public whitelist(...ids: string[]) {
    this.whitelisted.push(...ids);
    return this;
  }

  public async send() {
    if(!this.embed) throw new Error("You did not set an embed for your component menu!");
    if(!this.components) throw new Error("You did not set components for your component menu!");
    if(!this.interaction) throw new Error("This isn't normal, you did not provide an interaction for your component menu.");
    if(!this.trigger) throw new Error("You do not have a listener function!");
    
    if(this.menuMessage) {
      // Replace with current menu
      await this.menuMessage.edit({
        content: null,
        embeds: [this.embed],
        components: this.components
      });
    } else {
      // Reply to interaction
      this.menuMessage = await this.interaction.reply({
        embeds: [this.embed],
        components: this.components,
        fetchReply: true,
        ephemeral: this.options.ephemeral
      }) as Message;
    }

    // Listen
    const filter = (interaction: Interaction) => {
      if (this.whitelisted.includes(interaction.user.id)) {
        return true;
      }

      if (interaction.isButton() || interaction.isSelectMenu())
        interaction.reply({
          content: "This menu is not for you.",
          ephemeral: true,
        });

      return false;
    };

    // Create component collector.
    const collector = this.menuMessage.createMessageComponentCollector({
      filter,
      idle: this.options.idle
    });

    collector.on("collect", (...args) => {
      if(this.trigger) this.trigger(...args);
    });
    
    collector.on("end", async (_, r) => {
      this.components.forEach((a) => a.components.map((b) => b.setDisabled(true)));
      this.ended = true;
      await this.update();
      if (this.endTrigger) this.endTrigger(r);
    });
  }

  public update() {
    if(!this.menuMessage) return;
    if(!this.embed) throw new Error("You did not set an embed for your component menu!");
    if(!this.components) throw new Error("You did not set components for your component menu!");

    const editPayload: MessageEditOptions = {
      embeds: [this.embed],
      components: this.components,
    };

    if (this.ended && !this.options.silentDisable) {
      editPayload.content = "This menu has expired and is no longer valid!";
    }

    return this.menuMessage.edit(editPayload);
  }
}
