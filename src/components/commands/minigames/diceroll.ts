import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import findUserById from "../../../database/functions/economy/findUserById";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import userWeekly from "../../../database/models/UserWeeklyMissionsModel";
import userMonthly from "../../../database/models/UserMonthlyMissionsModel";
import { GamblingCardModel } from "../../../database/models/GamblingCardModel";

@ApplyOptions<Command.Options>({
  name: "diceroll",
  description: "Roll a dice and gamble your money away!",
})
export class DiceRollCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
          subcommand
            .setName("all")
            .setDescription("Bet with all your coins.")
            .addIntegerOption((option) =>
              option
                .setName("roll")
                .setDescription("What's your roll? 1-6")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(6)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("bet")
            .setDescription("Bet with some of your coins.")
            .addIntegerOption((option) =>
              option
                .setName("roll")
                .setDescription("What's your roll? 1-6")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(6)
            )
            .addIntegerOption((option) =>
              option
                .setName("bet")
                .setDescription("Your bet amount.")
                .setMinValue(50)
                .setRequired(true)
            )
        )
    );
  }

  public async chatInputRun(
    interaction: Command.ChatInputInteraction & {
      cardResult: boolean | undefined;
    }
  ) {
    //   usage: "diceroll <1-6> <bet>",

    let roll = interaction.options.getInteger("roll");
    let subcommand = interaction.options.getSubcommand();
    let all = (await findUserById(interaction.user.id)).coins;
    let amount = (
      subcommand === "all" ? all : interaction.options.getInteger("bet")
    ) as number;

    if (Number.isInteger(Number(amount)) && Number(amount) < 50)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(
              "You must bet 50 or more coins in a Dice Roll game <a:exclamation:741988026296696872>"
            ),
        ],
      });

    if ((await findUserById(interaction.user.id)).coins < Number(amount))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Insufficient Wallet Balance")
            .setDescription(
              "<a:RedTick:736282199258824774> How do you plan to flip more than you have in your wallet? 🥱"
            ),
        ],
      });

    let random = Math.floor(Math.random() * 6) + 1;

    if (roll === random) {
      let won = 5 * amount;

      const embed1 = new MessageEmbed()
        .setColor("#00FF00")
        .setTitle("You won! 🎉")
        .setDescription(
          `<a:YAY:783693442747727912> | Dice rolled to end up on **${random}** thus 6-folding your bet: **${won}** <a:Coins:775714101564276756>`
        );
      interaction.reply({ embeds: [embed1] });

      await Eco.updateOne(
        { id: interaction.user.id },
        { $inc: { coins: won } }
      );

      interaction.cardResult = true; // Message Author Won

      //Weekly Mission Section================
      if (amount > 999) {
        let weeklyDataW = await userWeekly.findOne({ id: interaction.user.id });
        if (!weeklyDataW) {
          await userWeekly.create({
            id: interaction.user.id,
            dr: { value: 1, wins: 1, loss: 0, prize: false, prizePlus: false },
          });
        } else {
          if (weeklyDataW.dr.value > 0) {
            weeklyDataW.dr.value += 1;
          } else {
            weeklyDataW.dr.value = 1;
          }
          if (weeklyDataW.dr.wins > 0) {
            weeklyDataW.dr.wins += 1;
          } else {
            weeklyDataW.dr.wins = 1;
          }
          weeklyDataW.save().catch((err: any) => console.log(err));
        }
      }
      //Weekly END=================================================================
      //return;
    } else {
      const embed1 = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("You Lost! 👎")
        .setDescription(
          `<a:crynig:748495941379817472> | You rolled a ${random} and lost your money!`
        );
      interaction.reply({ embeds: [embed1] });

      await Eco.updateOne(
        { id: interaction.user.id },
        { $inc: { coins: -amount } }
      );

      interaction.cardResult = false; // Message Author LOST

      //Monthly Mission Section================
      if (amount > 9999) {
        let monthlyDataL = await userMonthly.findOne({
          id: interaction.user.id,
        });
        if (!monthlyDataL) {
          await userMonthly.create({
            id: interaction.user.id,
            dr: { value: 1, wins: 0, loss: 1, prize: false, prizePlus: false },
          });
        } else {
          if (monthlyDataL.dr.value > 0) {
            monthlyDataL.dr.value += 1;
          } else {
            monthlyDataL.dr.value = 1;
          }
          if (monthlyDataL.dr.loss > 0) {
            monthlyDataL.dr.loss += 1;
          } else {
            monthlyDataL.dr.loss = 1;
          }
          monthlyDataL.save().catch((err: any) => console.log(err));
        }
      }
      //Monthly END=================================================================
      //return;
    }

    //GAMBLING CLUB STUFF===========
    const card = await GamblingCardModel.findOne({ id: interaction.user.id });
    if (card) {
      if (interaction.cardResult == true) {
        card.dr.wins += 1;
        card.dr.winnings += 5 * Number(amount);
      }
      if (interaction.cardResult == false) {
        card.dr.loss += 1;
        card.dr.losses += Number(amount);
      }
      card.dr.total += 1;
      card.dr.bets += Number(amount);

      card.save().catch((err: any) => console.log(err));
    }
    //GCC END============================================================================
  }
}
