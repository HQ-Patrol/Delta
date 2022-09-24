import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "candyshield",
  description: "Open a Candy pack and get a shield for upto 8 Rob attempts!",
})
export class CandyShieldCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription("What's the number?")
            .setRequired(false)
            .setMinValue(1)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    return interaction.reply(
      `Time limit to accumulate shields and to prevent yourself from getting robbed has ended!🛡`
    );
    let player = await Candy.findOne({ id: interaction.user.id });
    if (!player)
      return interaction.reply(
        `**You haven't started your Candy Land pilgrimage yet** <a:exclamation:741988026296696872>`
      );
    let packnum = interaction.options.getInteger("number") || 1;
    if (packnum < 1)
      return interaction.reply(
        "Error! Choose between a valid number of Packs <a:exclamation:741988026296696872> **Usage:** `!openpack <Number to Open>`"
      );
    if (!packnum || isNaN(packnum)) packnum = 1;
    // @ts-ignore
    if (player.Package < packnum)
      return interaction.reply(
        // @ts-ignore
        `You don't have enough Candy packs <a:exclamation:741988026296696872> **Inventory: ${player.Package}**`
      );
    // @ts-ignore
    player.Package = player.Package - packnum;
    // @ts-ignore
    player.shield = player.shield + 8 * packnum;
    // @ts-ignore
    await player.save();

    const emb = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `You opened **${packnum} ${
          packnum === 1 ? "pack" : "packs"
        }** which provided you with **${
          8 * packnum
        }** more Rob protection Shields 🛡<:GUNSHOT:745729904334733392>`
      )
      // @ts-ignore
      .setFooter({ text: `Total Shields count: ${player.shield} 👊` });
    await interaction.reply({ embeds: [emb] });
  }
}
