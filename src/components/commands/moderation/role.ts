import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, MessageEmbed, Permissions } from "discord.js";
import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "role",
  description: "Toggle a role on someone",
  requiredClientPermissions: "MANAGE_ROLES"
})
export class RoleCommand extends Command {
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
          .setDescription("The user to give a role to")
          .setRequired(true))
        .addRoleOption(o => o
          .setName("role")
          .setDescription("What role to give them?")
          .setRequired(true))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const user = interaction.options.getMember("user", true) as GuildMember;
    const roleId = interaction.options.getRole("role", true).id;
    const role = await interaction.guild?.roles.fetch(roleId)

    interaction.deferReply()

    const has = user.roles.cache.has(roleId)

    const embed = new MessageEmbed()
      .setColor("RANDOM")

    if (has){
      embed.setDescription(`${role} role was taken away from ${user}! ${emoji.redTick}`)
    } else {
      embed.setDescription(`${role} role was given to ${user}! ${emoji.greenTick}`)
    }

    try {
      await (has ? user.roles.remove(role!) : user.roles.add(role!));
      interaction.editReply({ embeds: [embed] })
    } catch {
      interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
    }
  }

}
