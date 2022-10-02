import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "candygamble",
  description:
    "Throw a dice in a 4 Candy Pack gamble against Satan in order to gain a random Infinity stone!",
})
export class CandyGambleCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription("Pick a number from 1-6")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(6)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const number = interaction.options.getInteger("number");

    const player = await Candy.findOne({ id: interaction.user.id });
    if (!player)
      return interaction.reply(
        `**You haven't started your Candy Land pilgrimage yet** <a:exclamation:741988026296696872> Type: \`!tt\` 💯`
      );
    if (player.Package < 4)
      return interaction.reply(
        `You currently have \`${player.Package}\` packs! You need **4 Candy Packs** to use this command <a:exclamation:741988026296696872>`
      );
    const random = Math.floor(Math.random() * 6) + 1;

    const emb = new MessageEmbed()
      .setTitle("Gamble started!")
      .setColor("RANDOM")
      .setDescription(
        `You bet \`4 Candy Packs\` against Satan & called out **${number}** <:sus:715633189871419554>\n\nLet's see if dice matches your number <a:Loading:727148666837663765>`
      )
      .setThumbnail("https://i.imgur.com/OrlWT1t.gif");

    await interaction.reply({ embeds: [emb] });

    await interaction.editReply({
      content: `3 <a:DiceThrow:763464624468918313>`,
      embeds: [],
    });
    await sleep(1000);
    await interaction.editReply({
      content: `2 <a:DiceThrow:763464624468918313>`,
      embeds: [],
    });
    await sleep(1000);
    await interaction.editReply({
      content: `1 <a:DiceThrow:763464624468918313>`,
      embeds: [],
    });
    await sleep(1000);

    if (number === random) {
      const thestone = [
        "soulstone",
        "mindstone",
        "timestone",
        "realitystone",
        "spacestone",
        "powerstone",
      ][Math.floor(Math.random() * 6)];
      await Candy.findOneAndUpdate(
        { id: interaction.user.id },
        {
          Package: player.Package - 5,
          candy: Object.assign(player.candy, {
            // @ts-ignore
            [thestone]: player.candy[thestone] + 1,
          }),
        }
      );
      const embed1 = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("You won! 🎉")
        .setDescription(
          `Satan rolled a ${random} and you receieved a **${thestone.toUpperCase()}**! <a:ThanosDance:763468378794754049>`
        );
      if (thestone === "spacestone")
        embed1.setImage("https://i.imgur.com/Dn7ug6K.gif");
      else if (thestone === "timestone")
        embed1.setImage("https://i.imgur.com/ML7Dq19.gif");
      else if (thestone === "realitystone")
        embed1.setImage("https://i.imgur.com/cZiDGLN.gif");
      else if (thestone === "soulstone")
        embed1.setImage("https://i.imgur.com/ccSehI9.gif");
      else if (thestone === "powerstone")
        embed1.setImage("https://i.imgur.com/ql7ZXCA.gif");
      else embed1.setImage("https://i.imgur.com/Qx0NMyH.gif");

      return interaction.editReply({ content: "", embeds: [embed1] });
    } else {
      await Candy.findOneAndUpdate(
        { id: interaction.user.id },
        { Package: player.Package - 4 }
      );

      const embed1 = new MessageEmbed()
        .setColor("RED")
        .setTitle("You Lost! 👎")
        .setDescription(
          `Satan rolled a ${random} and wiped out your Candy Packs from existence!`
        );

      return interaction.editReply({ content: "", embeds: [embed1] });
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
