import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { Permissions } from "discord.js";
import { error } from "../../../utilities/logger";

@ApplyOptions<Command.Options>({
  name: "mentionable",
  description: "Toggle if a role should be mentionable by everyone.",
  requiredClientPermissions: "MANAGE_ROLES"
})
export class MentionableCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .setDMPermission(false)
        .addRoleOption(o => o
          .setName("role")
          .setDescription("The role to toggle.")
          .setRequired(true))
        .addBooleanOption(o => o
          .setName("mentionable")
          .setDescription("Should be mentionable by everyone? (empty for toggle)")
          .setRequired(false))
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const roleId = interaction.options.getRole("role", true).id;
    const role = await interaction.guild?.roles.fetch(roleId);

    const state = interaction.options.getBoolean("mentionable") || !role?.mentionable

    interaction.deferReply({ ephemeral: true });

    try {
      role?.setMentionable(state);
      interaction.editReply(`${role} is now ${state ? "" : "not"} mentionable by everyone!`)
    } catch (e) {
      if (e instanceof Error){
        interaction.editReply("Failed to edit role!");
        error(e.message)
      }
    }
  }
}
