import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { Permissions, TextChannel } from "discord.js";
import { error } from "../../../utilities/logger";

@ApplyOptions<Command.Options>({
  name: "slowmode",
  description: "Set slowmode for the channel.",
  requiredClientPermissions: ["MANAGE_MESSAGES"]
})
export class SlowmodeCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_MESSAGES)
        .setDMPermission(false)
        .addNumberOption(o => o
          .setName("delay")
          .setDescription("How long do users need to wait to send another message")
          .setRequired(true))
        .addStringOption(o => o
          .setName("reason")
          .setDescription("Optional reason for this action.")
          .setRequired(false))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const channel = interaction.channel as TextChannel;
    const delay = interaction.options.getNumber("delay", true);
    const reason = interaction.options.getString("reason") || "";

    if (delay > 21600){
      return interaction.reply({ content: "You cannot set slowmode to more than 6 hours (21600 seconds)!" })
    }

    interaction.deferReply({ ephemeral: true })

    try {
      await channel.setRateLimitPerUser(delay, reason);
      interaction.editReply({ content: `Successfully set slowmode of ${delay}s for ${channel}!` })
    } catch (e){
      if (e instanceof Error){
        interaction.editReply({ content: "Failede to set slowmode!" })
        error(e.message)
      }
    }
  }
}
