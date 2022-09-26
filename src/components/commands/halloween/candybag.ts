import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import pretty from "pretty-ms";

@ApplyOptions<Command.Options>({
  name: "candybag",
  description:
    "Check the total amount of candies you've collected along with other information!",
})
export class CandyBagCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Who's candy bag would you like to see?")
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const player = await Candy.findOne({ id: user.id });
    if (!player)
      return interaction.reply(
        `<@${user.id}> haven't started their Candy Pilgrimage yet! Type: \`/trickortreat\` to get started on your journey! <:Skittles1:747102800835641435><:Skittles2:747102801221517452>`
      );
    const candies = Object.entries(player.candy)
      .filter(
        (x: any) => x[1] > 0 && !x[0].startsWith("$") && !x[0].endsWith("stone")
      )
      .map(
        (x: any) =>
          "• " + x[0][0].toUpperCase() + x[0].substring(1) + " - " + x[1]
      )
      .join("\n");
    const totalcandies = player.CandyCount;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(
        `${user.tag}'s Candy Bag 🎒`,
        user.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        `${candies}\n\n🎒 __**Total Candies**__: **\`${totalcandies}\`**${
          player.Package > 0
            ? `\n<:CandyPack:760232089953239120> __**Packages**__: **\`${player.Package}\`**`
            : ``
        }${
          player.shield > 0
            ? `${
                user.id == interaction.user.id
                  ? `\n🛡 __**Candy Shield**__: **\`${player.shield}\`**`
                  : ``
              }`
            : ``
        }${
          player.Snap > 0
            ? `\n<a:StoneSnap:760232908216074290> __**Snaps**__: **\`${player.Snap}\`**`
            : ``
        }${
          Date.now() < player.cooldown["cdaily"]
            ? `\n🛍 __**Daily**__: [Time Left: **${pretty(
                player.cooldown["cdaily"] - Date.now()
              )}s**]`
            : `\n🛍 __**Daily**__: **\`READY ‼\`**`
        }${
          Date.now() < player.boosterResetDate
            ? `\n✨ __**Booster**__: **\`x${player.booster}\`** [**${pretty(
                player.boosterResetDate - Date.now()
              )}** Left ⏱]`
            : ``
        }`
      )
      .addField(
        "**ιηƒιηιту ѕтσηєѕ**:",
        `<:MindStone:759495192998313984>: ${player.candy.mindstone} <:PowerStone:759495194168655882>: ${player.candy.powerstone} <:SpaceStone:759495194248216629>: ${player.candy.spacestone} <:TimeStone:759495193262293023>: ${player.candy.timestone} <:SoulStone:759495193493504040>: ${player.candy.soulstone} <:RealityStone:759495193778454538>: ${player.candy.realitystone}`
      )
      .setThumbnail("https://i.imgur.com/blbWvnR.gif")
      .setFooter({
        text: "• 𝘛𝘺𝘱𝘦: !𝘾𝙖𝙣𝙙𝙮𝙇𝙞𝙨𝙩 𝘵𝘰 𝘴𝘦𝘦 𝘢𝘭𝘭 𝘢𝘷𝘢𝘪𝘭𝘢𝘣𝘭𝘦 𝘤𝘢𝘯𝘥𝘪𝘦𝘴 𝘵𝘰 𝘤𝘰𝘭𝘭𝘦𝘤𝘵! 🍬",
      });
    return interaction.reply({ embeds: [embed] });
  }
}
