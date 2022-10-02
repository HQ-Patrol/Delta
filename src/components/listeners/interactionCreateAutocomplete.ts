import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { Interaction } from "discord.js";
import { searchForItem } from "../../utilities/query/item";
import { items } from "../../data/json/items.json";

const trimmedItems = items
  .filter((i) => i.data.canBeUsed)
  .map((i) => ({
    name: i.name,
    id: i.name2,
    alias: i.alias,
  }));
  
@ApplyOptions<Listener.Options>(() => ({
  event: "interactionCreate"
}))
export class InteractionCreateModalListener extends Listener {
  public async run(interaction: Interaction) {
    if(!interaction.isAutocomplete()) return;

	// item fuzzy autocomplete
	if(interaction.commandName === "use") {
		const value = interaction.options.getFocused();
		const choices = searchForItem(value, trimmedItems);
		if(Array.isArray(choices)) {
			await interaction.respond(choices.slice(0, 25).map((c) => ({ name: c.item.name, value: c.item.name })));
		}
	}
  }
}
