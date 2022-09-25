import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { Permissions } from "discord.js";
import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "unban",
  description: "Unban someone",
  requiredClientPermissions: "BAN_MEMBERS"
})
export class UnbanCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.BAN_MEMBERS)
        .addStringOption(o => o
          .setName("user")
          .setDescription("The user ID to unban")
          .setRequired(true))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const userId = interaction.options.getString("user", true)
    const user = await interaction.client.users.fetch(userId, { cache: true })
    if (!user) return interaction.reply({ content: "Couldn't find the member on the ban list.", ephemeral: true })

    interaction.deferReply()

    try {
      await interaction.guild?.members.unban(user)
      interaction.reply({ content: `${user.tag} has been unbanned and can be brought back to life🙌` })
    } catch {
      interaction.reply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
    }
  }

}
