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
        content: `*Unfortunately, __Patrol bot will be OFFLINE till January 2023__* <a:exclamation:741988026296696872>\n<a:Right:763251259896758282> If you still want to Use Patrol Bot, Visit our Official Server: https://discord.gg/HQ or [__**CLICK HERE TO ADD A TEMPORARY VERSION**__](https://discord.com/api/oauth2/authorize?client_id=1014553059956883507&permissions=8&scope=bot)`,
        ephemeral: true,
      });
    }
  }
}
