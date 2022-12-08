import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { Interaction, Message } from "discord.js";
import { PetModel } from "../../database/models/PetModel";

@ApplyOptions<Listener.Options>(() => ({
  event: "interactionCreate"
}))
export class InteractionCreateModalListener extends Listener {
  public async run(interaction: Interaction) {
    if(!interaction.isModalSubmit()) return;

    // Pet name modal
    if(interaction.customId.startsWith("petname")) {
      const split = interaction.customId.split("|");
      const context = split[1]
      const petUID = split[2];
      if(!context || !petUID) return; 

      const newName = interaction.fields.getTextInputValue("nameComponent");
      
      await PetModel.updateOne({ _id: petUID }, { name: newName });
      await interaction.reply({ content: 'Name change successful!', ephemeral: true });

      if(context === "new") {
        // Edit field with name __Name__, bold aswell:
        const embed = interaction?.message?.embeds[0];
        const field = embed?.fields?.find((f) => f.name === "__Name__");
        if(!embed || !field) return false;
        field.value = `**${newName}**`;
        await (interaction?.message as Message).edit({ embeds: [embed] });
      }
      return true;
    } 
  }
}
