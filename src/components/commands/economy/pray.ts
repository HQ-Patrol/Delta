import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageEmbed } from "discord.js";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import { ItemUseModel as ItemUse } from "../../../database/models/ItemUseModel";
import DeltaClient from "../../../utilities/classes/DeltaClient";
import findUserById from "../../../database/functions/economy/findUserById";

@ApplyOptions<Command.Options>({
  name: "pray",
  description: "Pray to the almighty God to bless your broke ass some 🍞",
})
export class PrayCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription("Get some quick coins. AMEN")
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {

    if (
        (interaction.client as DeltaClient).cooldowns.pray.get(
          interaction.user.id
        ) > Date.now()
      ) {
        interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(
                  `Please wait for another **${(
                    ((interaction.client as DeltaClient).cooldowns.pray.get(
                      interaction.user.id
                    ) -
                      Date.now()) /
                    1000
                  ).toFixed(
                    1
                  )}s** before praying again <a:exclamation:741988026296696872>`
                ),
            ],
          })
      } else {
    let rug=1;
		let special = await ItemUse.findOne({id: interaction.user.id})
		if(!special) rug=1; else { if(special.rugTime > Date.now()) rug=2;}

		const earn = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
    await findUserById(interaction.user.id);
			
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#00FF00")
            .setDescription(`You prayed to the Gods and they blessed you with **${earn*rug} coins** <a:Coins:775714101564276756>`)],
      }); 

			await Eco.updateOne(
			{ id: interaction.user.id },
			{ $inc: { coins: earn*rug } }
		  );

    (interaction.client as DeltaClient).cooldowns.pray.set(
      interaction.user.id,
      Date.now() + 30000
    );
  }
  }
}