import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import userWeekly from "../../../database/models/UserWeeklyMissionsModel";
import {
  randomFromArray,
  disableAllButtons,
} from "../../../utilities/query/pets";
const actions = ["<a:ROCK:943477023848935435>", "🧻", "✂️"];

@ApplyOptions<Command.Options>({
  name: "rps",
  description: "Try to beat a bot in a game of Rock-Paper-Scissors😼",
})
export class RPSCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const embed = new MessageEmbed()
      .setColor(`BLUE`)
      .setDescription("Choose one of the buttons below to play the game!");
    let components = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId("r")
        .setEmoji(actions[0]),
      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId("p")
        .setEmoji(actions[1]),
      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId("s")
        .setEmoji(actions[2])
    );
    let sentMessage = await interaction.reply({
      embeds: [embed],
      components: [components],
      fetchReply: true,
    });
    const filter = (cinteraction: any) =>
      ["r", "p", "s"].includes(cinteraction.customId) &&
      cinteraction.user.id === interaction.user.id;

    await sentMessage // @ts-ignore
      .awaitMessageComponent({ filter, time: 20000, max: 1, errors: ["time"] })
      .then(async (int: any) => {
        await int.deferUpdate();

        let input = int.component.emoji?.name;
        if (input === "ROCK") input = "<a:ROCK:943477023848935435>";
        let AIInput = randomFromArray(actions);

        // Draw
        if (input === AIInput) {
          //Weekly Mission Section================
          let weeklyDataL = await userWeekly.findOne({
            id: interaction.user.id,
          });
          if (!weeklyDataL) {
            await userWeekly.create({
              id: interaction.user.id,
              rps: {
                value: 1,
                wins: 0,
                loss: 0,
                tie: 1,
                prize: false,
                prizePlus: false,
              },
            });
          } else {
            if (weeklyDataL.rps.value > 0) {
              weeklyDataL.rps.value += 1;
            } else {
              weeklyDataL.rps.value = 1;
            }
            if (weeklyDataL.rps.tie > 0) {
              weeklyDataL.rps.tie += 1;
            } else {
              weeklyDataL.rps.tie = 1;
            }
            weeklyDataL.save().catch((err: any) => console.log(err));
          }
          //Weekly END=================================================================
          // @ts-ignore
          return sentMessage.edit({
            embeds: [
              embed
                .setAuthor({
                  name: `Result: DRAW!`,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`${input} **vs** ${AIInput}`)
                .setColor(`YELLOW`),
            ],
            components: [],
          });
        }
        // "<a:ROCK:943477023848935435>", "🧻", "✂️"
        else if (
          (input === "<a:ROCK:943477023848935435>" && AIInput === "✂️") ||
          (input === "🧻" && AIInput === "<a:ROCK:943477023848935435>") ||
          (input === "✂️" && AIInput === "🧻")
        ) {
          // Won
          // @ts-ignore
          return sentMessage.edit({
            embeds: [
              embed
                .setAuthor({
                  name: `Result: WON!`,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`${input} **vs** ${AIInput}`)
                .setColor(`YELLOW`),
            ],
            components: [],
          });
        } else {
          // Lost
          // @ts-ignore
          return sentMessage.edit({
            embeds: [
              embed
                .setAuthor({
                  name: `Result: LOST!`,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`${input} **vs** ${AIInput}`)
                .setColor(`YELLOW`),
            ],
            components: [],
          });
        }
      })
      .catch(async () => {
        disableAllButtons(components);
        // @ts-ignore
        await sentMessage.edit({
          content: "Times up! You didn't press any of the button!",
          components: [components],
        });
        return false;
      });
  }
}
