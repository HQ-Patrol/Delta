import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import config from "../../../config";
import { GuildMember, MessageEmbed, Permissions } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "say",
  description: "Say something!",
  cooldownDelay: 3
})
export class SayCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addStringOption(o => o
          .setName("message")
          .setDescription("What do you want to say?")
          .setRequired(true))
        .addBooleanOption(o => o
          .setName("embed")
          .setDescription("Fancy an embed along with it?")
          .setRequired(false))
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const msg = interaction.options.getString("message", true)
    const embed = !!interaction.options.getBoolean("embed")

    const banned = ["discord.gg", "www.", ".com", "https://"]

    if(banned.some(e => msg.includes(e))){
      if(!(interaction.member as GuildMember).permissions.has("BAN_MEMBERS") && (!config.owner.includes(interaction.user.id))) {
        return interaction.reply({ content: "__**Only Moderators of this Server**__ can make me add **LINKS** in the broadcasted message!", ephemeral: true })
      }
    }

    const roleColor = (interaction.member as GuildMember).displayHexColor === "#000000" ? "#ffffff" : (interaction.member as GuildMember).displayHexColor;

    if (embed){
      const embed = new MessageEmbed()
        .setColor(roleColor)
        .setDescription(msg)
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

      interaction.reply({ embeds: [embed] })
  } else {
      if (interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
        interaction.reply({ content: msg })
      } else {
        interaction.reply({ content: msg, allowedMentions: { parse: [] } })
      }
    }
  }

  }
