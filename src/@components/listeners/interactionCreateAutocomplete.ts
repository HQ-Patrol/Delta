import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { Interaction } from "discord.js";
import { searchForItem } from "../../utilities/query/item";

import { items } from "../../data/json/items.json";
import { badges } from "../../data/json/badges.json";
import { pets } from "../../data/json/pets.json";

const trimmedItems = items
    .filter((i) => i.data.canBeUsed)
    .map((i) => ({
        name: i.name,
        id: i.name2,
        alias: i.alias,
    }));

const trimmedPets = pets.map((pet) => pet.name);

@ApplyOptions<Listener.Options>(() => ({
    event: "interactionCreate"
}))
export class InteractionCreateModalListener extends Listener {
    public async run(interaction: Interaction) {
        if(!interaction.isAutocomplete()) return;

        let item = false, pet = false, badge = false;

        // completion for specific commands
        const focused = interaction.options.getFocused(true);
        // if field name is "use" or "item"
        item = focused.name === "use" || focused.name === "item";

        if(!item) {
            // get string option "type"
            const type = interaction.options.getString("type");
            if(!type) return;
            
            switch(type) {
                case "item":
                    item = true; break;
                case "badge":
                    badge = true; break;
                case "pet":
                    pet = true; break;
            }
        }

        // item autocomplete
        if(item) {
            const choices = searchForItem(focused.value, trimmedItems);
            if(Array.isArray(choices)) {
                await interaction.respond(choices.slice(0, 25).map((c) => ({ name: c.item.name, value: c.item.name })));
            }
        }

        // badge autocomplete
        if(badge) {
            const choices = badges.filter((badge) => badge.name.startsWith(focused.value)).slice(0, 25);
            await interaction.respond(choices.map((c) => ({ name: c.name, value: c.name })));
        }

        // pet autocomplete
        if(pet) {
            const choices = trimmedPets.filter((pet) => pet.startsWith(focused.value)).slice(0, 25);
            await interaction.respond(choices.map((c) => ({ name: c, value: c })));
        }
    }
}
