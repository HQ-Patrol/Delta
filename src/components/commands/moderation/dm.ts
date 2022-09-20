import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Permissions } from "discord.js";
import config from "../../../config";

@ApplyOptions<Command.Options>({
  name: "dm",
  description: "DM a user",
  cooldownDelay: 60
})
export class DmCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to message")
          .setRequired(true))
        .addStringOption(o => o
          .setName("message")
          .setDescription("The message to send the user")
          .setRequired(true))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!(config.verify.includes(interaction.user.id) || config.commanders.includes(interaction.user.id))) return interaction.reply({ content: "You don't have perms :(", ephemeral: true });

    interaction.deferReply({ ephemeral: true });
    const user = interaction.options.getMember("user", true) as GuildMember;
    const msg = interaction.options.getString("message", true);

    try {
      user.send({ content: msg })
      interaction.editReply("Successfully DM'd user.")
    } catch {
      interaction.editReply("Couldn't do it, probably closed DMs.")
    }
  }

}
