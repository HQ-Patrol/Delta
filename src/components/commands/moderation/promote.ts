import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, MessageEmbed, Permissions } from "discord.js";
import emoji from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "promote",
  description: "Gloriously give someone a role",
  requiredClientPermissions: "MANAGE_ROLES"
})
export class PromoteCommand extends Command {
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
          .setDescription("The user to promote")
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

    const random = ["https://i.imgur.com/ZARPpsF.gif", "https://i.imgur.com/JR1dfwp.gif", "https://i.imgur.com/8Czselh.gif", "https://i.imgur.com/ckxLBdv.gif", "https://i.imgur.com/lqCNTsa.gif"]
    const gif = random[Math.floor(Math.random() * random.length)]

    const embed = new MessageEmbed()
      .setColor("#FFD700")
      .setImage(gif)
      .setDescription(`👑 ***${user} is getting crowned with ${role} role for his glorious and unparalleled contribution to ${interaction.guild?.name} server!*** 👑`)

    try {
      await user.roles.add(role!);
      interaction.editReply({ embeds: [embed] })
    } catch {
      interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
    }
  }

}
