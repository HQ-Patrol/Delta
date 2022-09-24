import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";

@ApplyOptions<Command.Options>({
  name: "candyboost",
  description:
    "Open a candy pack and get a major candy boost in number of candies you receive for next 12 minutes!",
})
export class CandyBoostCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addIntegerOption((option) =>
          option
            .setName("packnum")
            .setDescription("Enter the number of packs.")
            .setMinValue(1)
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    let player = await Candy.findOne({ id: interaction.user.id });
    if (!player)
      return interaction.reply(
        "You haven't started your Candy Pilgrimage yet! Type: `/trickortreat` to get started <:Skittles1:747102800835641435><:Skittles2:747102801221517452>"
      );
    let packnum = interaction.options.getInteger("packnum") || 1;
    if (player.Package < packnum)
      return interaction.reply(
        `You don't have enough Candy packs <a:exclamation:741988026296696872> **Inventory: ${player.Package}**`
      );
    player.Package = player.Package - packnum;
    let booster = Math.floor(Math.random() * 4) + 2;
    if (player.booster > 0) {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
              `You opened **${packnum} ${
                packnum === 1 ? "pack" : "packs"
              }** and extended your **${player.booster}x** booster for **${
                12 * packnum
              }** more minutes! <a:AlarmGoBrrrrr:806180753167220806>`
            ),
        ],
      });
      player.boosterResetDate = player.boosterResetDate + 12 * 60000 * packnum;
    } else {
      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
              `You opened **${packnum} ${
                packnum === 1 ? "pack" : "packs"
              }** which will Multiply your candies by **x${booster}** for **${
                12 * packnum
              }** minutes! <a:AlarmGoBrrrrr:806180753167220806>`
            ),
        ],
      });
      player.booster = booster;
      player.boosterResetDate = Date.now() + 12 * 60000 * packnum;
    }
    await player.save();
  }
}
