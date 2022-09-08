import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildBasedChannel, Permissions } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "channelremove",
  description: "Remove any user/bot from any channel individually",
  requiredClientPermissions: "MANAGE_CHANNELS"
})
export class ChannelRemoveCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR)
        .setDMPermission(false)
        .addChannelOption(o => o
          .setName("channel")
          .setDescription("The channel to remove an user from")
          .setRequired(true))
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to remove from the channel")
          .setRequired(true))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const channel = interaction.options.getChannel("channel", true) as GuildBasedChannel
    if (channel.isThread()){
      interaction.reply({ content: "You cannot pick a thread channel.", ephemeral: true })
      return
    }
    const user = interaction.options.getUser("user", true)

    interaction.deferReply({ ephemeral: true });

    await channel.permissionOverwrites.create(
      user,
      channel.isVoice() ? {
        VIEW_CHANNEL: false,
        CONNECT: false,
        SPEAK: false,
      } : {
        VIEW_CHANNEL: false,
        READ_MESSAGE_HISTORY: false,
        SEND_MESSAGES: false,
        EMBED_LINKS: false,
        ATTACH_FILES: false,
      }
    )

    interaction.editReply({ content: `Removed ${user} from ${channel} successfully!` })
  }
}
