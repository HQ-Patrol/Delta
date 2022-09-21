import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Permissions } from "discord.js";
import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "unmute",
  description: "Unmute someone",
  requiredClientPermissions: "MANAGE_MESSAGES"
})
export class UnmuteCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_MESSAGES)
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to unmute")
          .setRequired(true))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const user = interaction.options.getMember("user", true) as GuildMember

    interaction.deferReply()

    try {
      await user.timeout(null)
      interaction.reply({ content: `${user} has been UNMUTED!` })
    } catch {
      interaction.reply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
    }
  }

}
