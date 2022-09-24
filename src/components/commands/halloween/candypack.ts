import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "candypack",
  description: "Collect 1 of each type of candies to turn it into a pack!",
})
export class CandyPackCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
          subcommand.setName("all").setDescription("Pack all types")
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("number")
            .setDescription("Pack a number")
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("What's the amount?")
                .setRequired(false)
                .setMinValue(1)
            )
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    let subCommand = interaction.options.getSubcommand();

    let player = await Candy.findOne({ id: interaction.user.id }).exec();
    if (!player)
      return interaction.reply(
        "You haven't started your Candy Pilgrimage yet! Type: `!trickortreat` to get started <:Skittles1:747102800835641435><:Skittles2:747102801221517452>"
      );
    let allcandies = Object.entries(player.candy).filter(
      (x) => !x[0].endsWith("stone") && !x[0].startsWith("$")
    );
    if (subCommand === "all") {
      let i = 0;
      // @ts-ignore
      while (allcandies.every((x) => x[1] > i)) {
        i++;
      }
      if (i === 0)
        return interaction.reply(
          "You don't seem to have all types of candy to successfully pack them <a:RedTick:736282199258824774>\n Type: `!cpack` to see which ones you missing!"
        );
      return pack(i);
    } else if (subCommand === "number") {
      let packnum = interaction.options.getInteger("amount") || 1;
      return pack(packnum);
    }
    async function pack(packnum: number) {
      // @ts-ignore
      if (allcandies.some((x) => x[1] < packnum)) {
        let missing = {};
        for (let i = 0; i < allcandies.length; i++) {
          let currcandy = allcandies[i];
          // @ts-ignore
          if (currcandy[1] >= packnum) continue;
          // @ts-ignore
          missing[currcandy[0]] = packnum - currcandy[1];
        }
        let embed = new MessageEmbed()
          .setColor("RED")
          .setTitle("<a:RedTick:736282199258824774> MISSING CANDIES")
          .setDescription(
            `You don't have enough candies to create ${packnum} packs!`
          )
          .addField(
            "Missing Candies:",
            Object.entries(missing)
              .map((x) => x[0].toUpperCase() + ": " + x[1])
              .join("\n")
          );
        return interaction.reply({ embeds: [embed] });
      }
      let newcandies = Object.fromEntries(
        // @ts-ignore
        allcandies.map((x) => [x[0], x[1] - packnum])
      );
      player = await Candy.findOneAndUpdate(
        { id: interaction.user.id },
        {
          // @ts-ignore
          candy: Object.assign(player.candy, newcandies),
          // @ts-ignore
          Package: player.Package + packnum,
          // @ts-ignore
          CandyCount: player.CandyCount - 20 * packnum,
        },
        { new: true }
      );
      return interaction.reply(
        // @ts-ignore
        `Packaging successful! <a:GreenTick:736282149094949096> \`Total Packages: ${player.Package}\``
      );
    }
  }
}
