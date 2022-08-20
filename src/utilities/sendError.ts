import { CommandInteraction, MessageEmbed } from "discord.js";

import emoji from "../constants/emoji";

export default function sendError(
  interaction: CommandInteraction,
  message: string,
  title?: string,
  ephemeral = true
) {
  const embed = new MessageEmbed()
    .setDescription(`${emoji.exclamation} ${message}`)
    .setColor("RED");
  if (title) embed.setTitle(title);
  return interaction.reply({
    embeds: [embed],
    ephemeral: ephemeral,
  });
}
