import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "ping",
  description: "Shows bot's current ping and latency!",
})
export class PingCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("ping").setDescription("Am I alive?")
    );
  }
  
  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const msg = await interaction.reply({ content: "Ping?", ephemeral: true, fetchReply: true });
    const diff = (msg as Message).createdTimestamp - interaction.createdTimestamp;
    const ping = Math.round(this.container.client.ws.ping);
    return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
  }
}
