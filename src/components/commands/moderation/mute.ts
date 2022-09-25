import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Permissions } from "discord.js";
import config from "../../../config";
import emoji from "../../../constants/emoji";
import ms from "ms";
import prettyMs from "pretty-ms";

@ApplyOptions<Command.Options>({
  name: "mute",
  description: "Mute someone",
  requiredClientPermissions: "MANAGE_MESSAGES"
})
export class MuteCommand extends Command {
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
          .setDescription("The user to mute")
          .setRequired(true))
        .addNumberOption(o => o
          .setName("duration")
          .setDescription("For how long? (e.g. 20m)")
          .setRequired(false))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!(config.owner.includes(interaction.user.id))) return interaction.reply({ content: "You don't have perms :(", ephemeral: true });

    const user = interaction.options.getMember("user", true) as GuildMember;
    const time = ms(interaction.options.getString("duration") || "60s")

    if (user.id === interaction.user.id) return interaction.reply({ content: "I don't think this is a good idea..." });
    if (!user.manageable) return interaction.reply({ content: "Yeah that's not gonna work, check your perms.", ephemeral: true })

    interaction.deferReply()

    try {
      await user.timeout(time)
      interaction.editReply({ content: `${user} has now been muted for \`${prettyMs(time)}\`` })
    } catch {
      interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
    }
  }

}
