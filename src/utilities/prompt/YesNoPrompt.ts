import {
  ButtonInteraction,
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { MessageComponentTypes } from "discord.js/typings/enums";
import emoji from "../../constants/emoji";

export async function YesNoPrompt(
  interaction: CommandInteraction,
  askMessage: string,
  yesButtonLabel = "Yes",
  noButtonLabel = "No"
): Promise<[boolean | null, Message]> {
  const message = (await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setColor("YELLOW")
        .setDescription(`${emoji.exclamation} ${askMessage}`)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        }),
    ],
    components: [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("yes")
          .setStyle("SUCCESS")
          .setLabel(yesButtonLabel),
        new MessageButton()
          .setCustomId("no")
          .setStyle("DANGER")
          .setLabel(noButtonLabel)
      ),
    ],
    fetchReply: true,
  })) as Message;

  const filter = (int: ButtonInteraction) => {
    if (int.user.id == interaction.user.id) {
      int.deferUpdate();
      return true;
    }

    if (int.isButton())
      int.reply({
        content: "This menu is not for you.",
        ephemeral: true,
      });

    return false;
  };

  const response = await message
    .awaitMessageComponent({
      filter,
      componentType: MessageComponentTypes.BUTTON,
      time: 30_000,
    })
    .then((int) => int.customId === "yes")
    .catch(() => null);

  return [response, message];
}