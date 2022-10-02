import { MessageEmbed, TextChannel } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import pretty from "pretty-ms";

@ApplyOptions<Command.Options>({
  name: "candydaily",
  description: "Get 25 random candies daily!",
})
export class CandyDailyCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const player = await Candy.findOne({ id: interaction.user.id });
    if (!player) {
      await Candy.create({ id: interaction.user.id });
      return interaction.reply(
        `\`You just picked up your Candy bag 🎒 and started your quest of collecting tastiest and most candies! Sweet :)\``
      );
    }

    if (
      !player.cooldown ||
      !player.cooldown["cdaily"] ||
      player.cooldown["cdaily"] < Date.now()
    ) {
      player.cooldown = { cdaily: Date.now() + 24 * 60 * 60 * 1000 };
      await player.save();
    } else {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`Daily Cooldown ‼`)
            .setColor("RED")
            .setDescription(
              `${interaction.user} has to wait another **${pretty(
                player.cooldown["cdaily"] - Date.now()
              )}** before using the \`CandyDaily\` command <a:exclamation:741988026296696872>`
            ),
        ],
      });
    }

    const added = {};
    let candiestaken = 0;
    while (candiestaken < 25) {
      const randomcandy = Object.keys(player.candy).filter(
        (x) => !x.endsWith("stone") && !x.startsWith("$")
      )[
        Math.floor(
          Math.random() *
            Object.keys(player.candy).filter(
              (x) => !x.endsWith("stone") && !x.startsWith("$")
            ).length
        )
      ];
      let taken;
      taken = Math.floor(Math.random() * (25 - candiestaken)) + 1;
      // @ts-ignore
      added[randomcandy] = added[randomcandy] + taken || taken;
      // @ts-ignore
      player.candy[randomcandy] = player.candy[randomcandy] + taken;
      candiestaken += taken;
    }
    player.CandyCount = player.CandyCount + 25;
    await player.save();

    const stolenmessage = Object.entries(added)
      .map((x) => `\`${x[0].toUpperCase()}\`` + " - " + `\`${x[1]}\``)
      .join("\n");

    const emb = new MessageEmbed()
      .setColor("RANDOM")
      .setFooter({ text: `➛ Visit: patrolbot.xyz/Store for more 🎁` })
      .setThumbnail("https://i.imgur.com/dmCJqH1.gif")
      .setTitle(`You got your Daily 25 Candies! 🍬🎁`)
      .setDescription(
        "Candies you received in your daily Candy Gift box:\n" + stolenmessage
      );
    await interaction.reply({ embeds: [emb] });
    return (
      interaction.client.channels.cache.get("892081659527172146") as TextChannel
    ).send(
      `${interaction.user.username} [${interaction.user.id}] Claimed their DAILY <a:Candy1:747106214273613824> in ${interaction.guild} [${interaction.guild?.id}]`
    );
  }
}
