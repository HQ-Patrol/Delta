import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Permissions } from "discord.js";
import config from "../../../config";
import emoji from "../../../constants/emoji";
import { YesNoPrompt } from "../../../utilities/prompt/YesNoPrompt";

@ApplyOptions<Command.Options>({
  name: "kick",
  description: "Kick someone",
  requiredClientPermissions: "KICK_MEMBERS"
})
export class KickCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.KICK_MEMBERS)
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to kick")
          .setRequired(true))
        .addStringOption(o => o
          .setName("reason")
          .setDescription("Reason for kick")
          .setRequired(false))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!(config.owner.includes(interaction.user.id))) return interaction.reply({ content: "You don't have perms :(", ephemeral: true });

    const user = interaction.options.getMember("user", true) as GuildMember;
    const reason = interaction.options.getString("reason", true);

    if (user.id === interaction.user.id) return interaction.reply({ content: "Stop seeking attention Jeez. You know you can't ban yourself" });
    if (!user.kickable) return interaction.reply({ content: "I can't possibly kick a God while being a peasant myself😫 Move me up in roles, maybe😏", ephemeral: true })

    interaction.deferReply()

    try {
      const prompt = await YesNoPrompt(interaction, "Are you sure?");
      if (!prompt) return interaction.editReply({ content: `You just spared ${user}'s life!` })
      await user.kick(reason);
      interaction.editReply({ content: `*⚡${user.user.username} just got Zzzzapped out of the server! Good Riddance!*` })
    } catch {
      interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
    }
  }

}
