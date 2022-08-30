import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { HexColorString, MessageEmbed, Permissions } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "addrole",
  description: "Add a role!",
  requiredClientPermissions: "MANAGE_ROLES",
})
export class AddRoleCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .addStringOption(o => o
          .setName("name")
          .setDescription("Name of the new role")
          .setRequired(true))
        .addStringOption(o => o
          .setName("color")
          .setDescription("Hex color of your new role (#123456)")
          .setRequired(true))
    );
  }

  private hexRegex = /^#(?:[\da-f]{3}){1,2}$/i;

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const name = interaction.options.getString("name", true);
    const color = interaction.options.getString("color", true) as HexColorString
    if (!this.hexRegex.test(color)) {
      return interaction.reply({ content: "Invalid hex color!\nMake sure your color starts with a `#` and has at least 3 digits.\nE.g. `#fff`, `#123f4d`", ephemeral: true });
    }

    interaction.deferReply({ ephemeral: true });

    const role = await interaction.guild?.roles.create({ name, color }).catch();
    const embed = new MessageEmbed()
      .setTitle("New role created!")
      .setDescription(`${interaction.user} has created the role ${role}\nHex: \`${color}\`\nID: \`${role?.id}\``)
      .setColor(color);

    interaction.editReply({ embeds: [embed] });
  }
}
