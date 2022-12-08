import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { Interaction } from "discord.js";

@ApplyOptions<Listener.Options>(() => ({
  event: "interactionCreate",
}))
export class InteractionCreateListener extends Listener {
  public async run(interaction: Interaction) {
    if (interaction.isCommand()) {
      return interaction.reply({
        content: "Sin Edit THis",
        ephemeral: true,
      });
    }
  }
}
