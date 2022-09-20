import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, MessageEmbed, Permissions } from "discord.js";
import config from "../../../config";
import emoji from "../../../constants/emoji";
import { error } from "../../../utilities/logger";

@ApplyOptions<Command.Options>({
  name: "dethrone",
  description: "Used to take a certain role from someone but in a more chaotic and emotional way. `Should be used only on occassions on demotions, etc`",
  requiredClientPermissions: "MANAGE_ROLES"
})
export class DemoteCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription("Loudly take a role from someone.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to take the role from")
          .setRequired(true))
        .addRoleOption(o => o
          .setName("role")
          .setDescription("The role to remove from them")
          .setRequired(true))

    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!config.owner.includes(interaction.user.id)) return interaction.reply("No perms :(");
    interaction.deferReply();
    const user = interaction.options.getMember("user", true) as GuildMember
    const roleId = interaction.options.getRole("role", true).id;
    const role = await interaction.guild?.roles.fetch(roleId)

    const random = ["https://i.imgur.com/fdfpF0K.gif", "https://i.imgur.com/wpEsa9Y.gif"]
    const gif = random[Math.floor(Math.random() * random.length)]

    const embed = new MessageEmbed()
      .setColor("#be0000")
      .setImage(gif)
      .setDescription(`__**${user} was found unworthy of his status**__. *Thus, ${role} along with all it's powers is effective immediately taken away from them till the day they prove their calibre again!* ${emoji.notAmused}${emoji.redTick}`)

    try {
      user.roles.remove(role!)
      interaction.editReply({ embeds: [embed] });
    } catch (e) {
      if (e instanceof Error) {
        interaction.editReply("Couldn't do it. Check your perms.")
        error(e.message);
      }
    }
  }
}
