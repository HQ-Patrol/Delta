import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { Permissions } from "discord.js";
import { error } from "../../../utilities/logger";

@ApplyOptions<Command.Options>({
  name: "delrole",
  description: "Delete a specified role.",
  requiredClientPermissions: "MANAGE_ROLES",
  cooldownDelay: 2
})
export class DeleteRoleCommand extends Command {
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
          .setDescription("The role you want to delete.")
          .setRequired(true)
        )
        .addStringOption(o => o
          .setName("reason")
          .setDescription("Reason for deleting the role.")
          .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
      const roleId = interaction.options.getRole("role", true).id;
      const role = await interaction.guild?.roles.fetch(roleId)

      const reason = interaction.options.getString("reason") || "";

      interaction.deferReply({ ephemeral: true });

      try {
        role?.delete(reason)
        interaction.editReply({ content: `Successfuly deleted ${role?.name}!` });
      } catch (e) {
        if (e instanceof Error) {
          interaction.editReply({ content: "Sorry, can't delete that role!" });
          error(e.message);
        }
      }
  }
}
