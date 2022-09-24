import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import findUserById from "../../../database/functions/economy/findUserById";

import { getMaximumCompacity } from "../../../utilities/query/economy";
import sendError from "../../../utilities/sendError";

import emojis from "../../../constants/emoji";

@ApplyOptions<Command.Options>({
  name: "balance",
  description: "View your balance or somebody elses balance.",
})
export class BalanceCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Want to peek into somebody elses wallet?")
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;
    if (user.bot) return sendError(interaction, "Bots are way too rich!");

    const person = await findUserById(user.id);
  
    const capacity = getMaximumCompacity(person.level, person.bracket);

    if (user.id === "735281000044691509") {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .addFields(
              {
                name: `${emojis.wallet} Wallet:`,
                value: `${emojis.gunshot} ${emojis.coins}`,
                inline: true,
              },
              {
                name: "🏧 Bank:",
                value: `${emojis.gunshot} ${emojis.coins}`,
                inline: true,
              },
            )
            .setAuthor({
              name: `${user.username}'s Balance 💰`,
              iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail("https://i.imgur.com/fYOtU81.gif")
            .setFooter({ text: "Mind your own Bread..." }),
        ],
      });
    }
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .addFields(
            {
              name: `${emojis.wallet} Wallet:`,
              value: `${person.coins} ${emojis.coins}`,
              inline: true,
            },
            {
              name: "🏧 Bank:",
              value: `${person.bank}/**${capacity}** ${emojis.coins}`,
              inline: true,
            },
          )
          .setAuthor({
            name: `${user.username}'s Balance 💰`,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail("https://i.imgur.com/fYOtU81.gif")
          .setFooter({ text: "➤ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ 🥶" })
          .setTimestamp(),
      ],
    });
  }
}
