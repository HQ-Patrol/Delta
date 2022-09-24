import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { stripIndents } from "common-tags";

@ApplyOptions<Command.Options>({
  name: "candylist",
  description: "Shows the whole brochure of candies you can obtain",
})
export class CandyListCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    await interaction.deferReply();
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("🎃 Halloween Candy List 🍭")
      .addField(
        "Candies:",
        stripIndents`\`•\` **WonkaBar** | ʀᴀʀᴇ \n\`•\` **Pocky** | ᴜɴᴄᴏᴍᴍᴏɴ\n\`•\` **Skittles** | ᴜɴᴄᴏᴍᴍᴏɴ\n\`•\` **SourPatch** | ᴜɴᴄᴏᴍᴍᴏɴ\n\`•\` **Caramel** | ᴜɴᴄᴏᴍᴍᴏɴ\n\`•\` **Chocolate** | ᴜɴᴄᴏᴍᴍᴏɴ\n\`•\` **Bonbon** | ᴄᴏᴍᴍᴏɴ\n\`•\` **CandyButton** | ᴄᴏᴍᴍᴏɴ\n\`•\` **CandyCane** | ᴄᴏᴍᴍᴏɴ\n\`•\` **Marshmallow** | ᴄᴏᴍᴍᴏɴ\n\`•\` **Bubblegum** | ᴄᴏᴍᴍᴏɴ\n\`•\` **Gumball** | ᴄᴏᴍᴍᴏɴ\n\`•\` **Gummybear** | ᴄᴏᴍᴍᴏɴ\n\`•\` **Toffee** | ᴄᴏᴍᴍᴏɴ\n\`•\` **JellyBean** | ᴄᴏᴍᴍᴏɴ\n\`•\` **JollyRancher** | ᴄᴏᴍᴍᴏɴ\n\`•\` **Lollipop** | ᴄᴏᴍᴍᴏɴ\n\`•\` **MintCandy** | ᴄᴏᴍᴍᴏɴ\n\`•\` **Jawbreaker** | ᴄᴏᴍᴍᴏɴ\n\`•\` **CandyStick** | ᴄᴏᴍᴍᴏɴ\n`,
        true
      )
      .addField(
        "Infinity Stones:",
        stripIndents`\`1.\` **TimeStone** | ᴠᴇʀʏ ʀᴀʀᴇ\n\`2.\` **PowerStone** | ᴠᴇʀʏ ʀᴀʀᴇ\n\`3.\` **MindStone** | ᴠᴇʀʏ ʀᴀʀᴇ\n\`4.\` **SpaceStone** | ᴠᴇʀʏ ʀᴀʀᴇ\n\`5.\` **SoulStone** | ᴠᴇʀʏ ʀᴀʀᴇ\n\`6.\` **RealityStone** | ᴠᴇʀʏ ʀᴀʀᴇ`,
        true
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    interaction.user
      .send({ embeds: [embed] })
      .then(() =>
        interaction.editReply(
          "🧁 Please Check your DMs for a full list of candies you can obtain! 🍬"
        )
      )
      .catch(() =>
        interaction.editReply(
          "`Unlucky! You have DM's closed` <:sus:715633189871419554>"
        )
      );
  }
}
