import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Permissions } from "discord.js";
import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "nick",
  description: "Change someone's nickname",
  requiredClientPermissions: "MANAGE_NICKNAMES"
})
export class NickCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_NICKNAMES)
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to nickname")
          .setRequired(true))
        .addNumberOption(o => o
          .setName("nickname")
          .setDescription("What do we call him?")
          .setRequired(true))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const user = interaction.options.getMember("user", true) as GuildMember;
    const nick = interaction.options.getString("nick", true)

    interaction.deferReply()

    try {
      await user.setNickname(nick)
      interaction.editReply({ content: `Successfully changed **${user}**'s nickname to **${nick}**` })
    } catch {
      interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
    }
  }

}
