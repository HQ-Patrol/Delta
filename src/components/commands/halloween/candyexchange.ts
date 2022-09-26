import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { TextChannel } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "candyexchange",
  description:
    "Make a request to exchange all your Candies, stones and Packs for Coins",
})
export class CandyExchangeCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const player = await Candy.findOne({ id: interaction.user.id });
    if (!player) return interaction.reply(`What?`);
    if (player.Package < 0 && player.CandyCount < 0)
      return interaction.reply(
        `You have 0 Candy or Candy Packs. You need atleast 1 candy to request for any sort of Exchange <a:exclamation:741988026296696872>`
      );

    interaction.reply(
      `Your Exchange request has been sent for Approval ✅ Please wait Patiently as it can take upto 1-5 days :)\n\n\`- Please don't Re-do this command\`\n\`- If your Exchange value is less than 5000 coins, it won't be approved\``
    );
    await (
      interaction.client.channels.cache.get("892081659527172146") as TextChannel
    )
      ?.send(
        `${interaction.user.tag} requested in Guild: ${interaction.guild?.name} to exchange their **Candies**: \`${player.CandyCount}\`\n**Packages**: \`${player.Package}\`\n<:MindStone:759495192998313984>: ${player.candy.mindstone} <:PowerStone:759495194168655882>: ${player.candy.powerstone} <:SpaceStone:759495194248216629>: ${player.candy.spacestone} <:TimeStone:759495193262293023>: ${player.candy.timestone} <:SoulStone:759495193493504040>: ${player.candy.soulstone} <:RealityStone:759495193778454538>: ${player.candy.realitystone}`
      )
      ?.catch(() => {});
    return;
  }
}
