import { ApplicationCommand, Client, Interaction } from "discord.js";

export interface Command {
  slash: {
    data: ApplicationCommand,
    handler: (client: Client, interaction: Interaction) => Promise<void>
  }
}
