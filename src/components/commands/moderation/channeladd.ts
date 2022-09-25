import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildBasedChannel, Permissions } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "channeladd",
  description: "Add any user/bot in any channel individually",
  requiredClientPermissions: "MANAGE_CHANNELS"
})
export class ChannelAddCommand extends Command {
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
          .setDescription("The channel to add an user into")
          .setRequired(true))
        .addUserOption(o => o
          .setName("user")
          .setDescription("The user to add to the channel")
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

    interaction.deferReply({ ephemeral: true })

    await channel.permissionOverwrites.create(
      user,
      channel.isVoice() ? {
        VIEW_CHANNEL: true,
        CONNECT: true,
        SPEAK: true,
      } : {
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
        SEND_MESSAGES: true,
        EMBED_LINKS: true,
        ATTACH_FILES: true,
      }
    )

    interaction.editReply({ content: `${user} has been added to ${channel} successfully!` });
  }
}
