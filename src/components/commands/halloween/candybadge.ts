import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { BadgesModel as BADGES } from "../../../database/models/BadgesModel";
import Badges from "../../../data/json/badges.json";

@ApplyOptions<Command.Options>({
  name: "candybadge",
  description: "Give you a Candy Badge in exchange for 25 Packs",
})
export class CandyBadgeCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    let player = await Candy.findOne({ id: interaction.user.id });
    if (!player)
      return interaction.reply(
        `**You haven't started your Candy Land pilgrimage yet** <a:exclamation:741988026296696872> Type: \`/tt\` 💯`
      );
    if (player.Package < 25)
      return interaction.reply(
        `You currently have \`${player.Package}\` packs! You need **25 Candy Packs** to use this command <a:exclamation:741988026296696872>`
      );

    //Halloween Badge Addition=========================
    var badge = Badges.badges.filter(
      (b) => b.name.toLowerCase() === "candy hunter 2021"
    )[0];

    var _badges = await BADGES.findOne({ id: interaction.user.id });

    if (!_badges) {
      var b = new BADGES({
        id: interaction.user.id,
        badges: [badge],
      });

      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
              `<a:ThanosDance:763468378794754049> | ${interaction.user} **is being awarded with the badge: __Candy Hunter 2021__** for their exceptional performance in Patrol Bot: Halloween Event ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
            ),
        ],
      });

      await Candy.findOneAndUpdate(
        { id: interaction.user.id },
        { Package: player.Package - 25 }
      );
      await b.save();
      return;
    } else {
      var exists = await BADGES.findOne({
        id: interaction.user.id,
        badges: { $in: [badge] },
      });

      if (exists) return interaction.reply("Bruh moment.");

      await BADGES.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $addToSet: { badges: [badge] },
        }
      );

      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
              `<a:ThanosDance:763468378794754049> | ${interaction.user} **is being awarded with the badge: __Candy Hunter 2021__** for their exceptional performance in Patrol Bot: Halloween Event ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
            ),
        ],
      });
    }
    //==================================

    await Candy.findOneAndUpdate(
      { id: interaction.user.id },
      { Package: player.Package - 25 }
    );
  }
}
