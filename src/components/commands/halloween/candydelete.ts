import { GuildMember } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import config from "../../../config.json";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";

@ApplyOptions<Command.Options>({
  name: "candydelete",
  description: "Takes someone's candy bag!",
})
export class CandyDeleteCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to take candy bags of.")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    // @ts-ignore
    if (!config.owner.includes(interaction.user.id)) {
      return interaction.reply("No.");
    }

    const member = interaction.options.getMember("member") as GuildMember;

    Candy.findOneAndDelete(
      {
        id: member.user.id,
      },
      (err: any, _res: any) => {
        if (err) console.log(err);
        console.log(
          member.user.username +
            " with ID: " +
            member.user.id +
            " has been permanently wiped out from the database! GG👍"
        );
        return interaction.reply(
          `\`\`\`${member.user.username} with ID: ${member.user.id} lost their candy bag and lost all the progress. GG👍\`\`\``
        );
      }
    );
  }
}
