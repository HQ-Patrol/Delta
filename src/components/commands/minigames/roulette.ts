import { MessageEmbed, TextBasedChannel } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import findUserById from "../../../database/functions/economy/findUserById";
import userMonthly from "../../../database/models/UserMonthlyMissionsModel";
import { GamblingCardModel } from "../../../database/models/GamblingCardModel";
import { Economy } from "../../../database/models/EconomyModel";

const colorValues = ["black", "red"];
const parityValues = ["even", "odd"];
const rowValues = ["1st", "2nd", "3rd"];

const reds = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
const blacks = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

const getRow = (num: number) => {
  return num % 3 === 0 ? 3 : num % 3;
};

const duration = 30000;
const runningRounds = new Map();

class Participant {
  id: any;
  bet: any;
  constructor(id: any, bet: any) {
    this.id = id;
    this.bet = bet;
  }
}

class Winner {
  id: any;
  amount: any;
  constructor(id: any, amount: number) {
    this.id = id;
    this.amount = amount;
  }
}

class RouletteRound {
  participants: any;
  channel: any;
  endsAt: number;
  timeout: any;
  constructor(channel: TextBasedChannel) {
    this.channel = channel;
    this.participants = [];
    this.endsAt = Date.now() + duration;
    this.timeout = setTimeout(async () => {
      const number = Math.floor(Math.random() * 37);
      let text = `➡️ The Ball landed on: **${
        reds.includes(number) ? "red" : "black"
      } ${number}**!\n\n`;

      const winners = [];

      for (const participant of this.participants) {
        const user = channel.client.users.cache.get(participant.id);
        if (user) {
          let winAmount = 0;
          if (
            participant.bet.type === "number" &&
            participant.bet.number === number
          ) {
            winAmount = participant.bet.amount * 36;
          } else if (
            participant.bet.type === "range" &&
            number >= participant.bet.min &&
            number <= participant.bet.max
          ) {
            winAmount = participant.bet.amount * 3;
          } else if (
            participant.bet.type === "parity" &&
            ((participant.bet.parity.toLowerCase() === "even" &&
              number % 2 === 0) ||
              (participant.bet.parity.toLowerCase() === "odd" &&
                number % 2 === 1))
          ) {
            winAmount = participant.bet.amount * 2;
          } else if (
            participant.bet.type === "color" &&
            ((participant.bet.color.toLowerCase() === "red" &&
              reds.includes(number)) ||
              (participant.bet.color.toLowerCase() === "black" &&
                blacks.includes(number)))
          ) {
            winAmount = participant.bet.amount * 2;
          } else if (
            participant.bet.type === "row" &&
            participant.bet.row === getRow(number)
          ) {
            winAmount = participant.bet.amount * 3;
          }
          if (winAmount) {
            winners.push(new Winner(participant.id, winAmount));
          }
          await Economy.updateOne(
            { id: participant.id },
            { $inc: { coins: winAmount } }
          );
          let card = await GamblingCardModel.findOne({ id: participant.id });
          if (card) {
            if (winAmount > 0) {
              card.rt.winnings += winAmount;
              card.rt.wins += 1;
            }
            await card.save().catch((err: any) => console.log(err));
          }
        }
      }

      if (winners.length) {
        text += "__**WINNERS:**__\n";
        text += winners
          .map(
            (x) =>
              `➜ <@${x.id}> won **${x.amount} <a:Coins:775714101564276756>**`
          )
          .join("\n");
      } else {
        text += `**There was no Winner** <a:notamused:750080936191721512>`;
      }
      if (number == 0) {
        text += "\n**`DISCLAIMER:`** - 0 ɪꜱ ɴᴇɪᴛʜᴇʀ ᴀ ʙʟᴀᴄᴋ ɴᴏʀ ʀᴇᴅ";
      }
      channel.send(text);
      runningRounds.delete(channel.id);
    }, duration);
  }
}

@ApplyOptions<Command.Options>({
  name: "roulette",
  description:
    "The classic game of Roulette on Patrol Bot. Unlimited bets within 30 seconds of starting the round.",
})
export class RouletteCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addStringOption((option) =>
          option.setName("bet").setDescription("Your bet?").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("call").setDescription("Your call?").setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const args = [
      interaction.options.getString("bet"),
      interaction.options.getString("call"),
    ] as any;

    const economyData = await findUserById(interaction.user.id);

    var amount = parseInt(args.shift());
    let all = economyData.coins;
    if (!Number(amount)) amount = all;

    if (isNaN(Number(amount)) || !Number.isInteger(Number(amount))) {
      return interaction.reply(
        "Invalid bet format <a:exclamation:741988026296696872> \n➜ __**Example:**__\n-`roulette 100 odd\\even`\n-`roulette 100 1st\\2nd\\3rd`\n-`roulette 100 1-12\\13-24\\25-36`\n-`roulette 100 <0-36>`"
      );
    }

    if (economyData.coins < amount) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Insufficient Wallet Balance")
            .setDescription(
              `<a:RedTick:736282199258824774> You don't have enough coins in your wallet? 🥱`
            ),
        ],
      });
    }

    if (Number.isInteger(Number(amount)) && Number(amount) < 100)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(
              "You must place a bet of 100 or more coins <a:exclamation:741988026296696872>"
            ),
        ],
      });

    const bet = {
      amount,
      type: /^\d+$/.test(args[0])
        ? "number"
        : /^\d+-\d+$/.test(args[0])
        ? "range"
        : new RegExp(`${parityValues.join("|")}`, "i").test(args[0])
        ? "parity"
        : new RegExp(`${colorValues.join("|")}`, "i").test(args[0])
        ? "color"
        : new RegExp(`${rowValues.join("|")}`, "i").test(args[0])
        ? "row"
        : "unknown",
    } as any;
    if (bet.type === "unknown") {
      return interaction.reply(
        "Invalid bet option <a:exclamation:741988026296696872> \n➜ __**Example:**__\n-`roulette 100 odd\\even`\n-`roulette 100 1st\\2nd\\3rd`\n-`roulette 100 1-12\\13-24\\25-36`\n-`roulette 100 <0-36>`"
      );
    } else if (bet.type === "number") {
      bet.number = parseInt(args[0]);
    } else if (bet.type === "range") {
      bet.min = parseInt(args[0].split("-")[0]);
      bet.max = parseInt(args[0].split("-")[1]);
    } else if (bet.type === "parity") {
      bet.parity = args[0];
    } else if (bet.type === "color") {
      bet.color = args[0];
    } else if (bet.type === "row") {
      bet.row = parseInt(args[0][0]);
    }

    if (bet.type === "number" && (bet.number < 0 || bet.number > 36)) {
      return interaction.reply(
        `Invalid number: **${bet.number}**. Only \`0-36\` are allowed.`
      );
    }
    if (
      bet.type === "range" &&
      ((bet.min !== 1 && bet.min !== 13 && bet.min !== 25) ||
        (bet.max !== 12 && bet.max !== 24 && bet.max !== 36))
    ) {
      return interaction.reply(
        `Invalid range: **${bet.min}-${bet.max}**. Only \`1-12\`, \`13-24\` and \`25-36\` are allowed.`
      );
    }

    if (
      (bet.min == 1 && bet.max == 36) ||
      (bet.min == 13 && bet.max == 36) ||
      (bet.min == 1 && bet.max == 24) ||
      (bet.min == 25 && bet.max == 12) ||
      (bet.min == 25 && bet.max == 24) ||
      (bet.min == 13 && bet.max == 12)
    ) {
      return interaction.reply(
        `Invalid range: **${bet.min}-${bet.max}**. Only \`1-12\`, \`13-24\` and \`25-36\` are allowed.`
      );
    }

    let runningRound = runningRounds.get(interaction.channel?.id);

    if (!runningRound) {
      runningRound = new RouletteRound(interaction.channel as TextBasedChannel);
      runningRounds.set(interaction.channel?.id, runningRound);
    }

    if (runningRound.participants.length >= 10) {
      return interaction.reply(
        `**10 people already participated!**, try again next round? <a:ThanosDance:763468378794754049>`
      );
    }

    runningRound.participants.push(new Participant(interaction.user.id, bet));

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor({
            name: "Roulette Bet Placed ☑️",
            iconURL: "https://i.imgur.com/IKxOuaH.gif",
          })
          .setDescription(
            `${interaction.user} placed a bet of **${amount}** Coins on \`${args[0]}\` <a:Coins:775714101564276756>`
          )
          .setFooter({
            text: `Time remaining: ${Math.round(
              (runningRound.endsAt - Date.now()) / 1000
            )} seconds`,
          }),
      ],
    });

    economyData.coins -= amount;
    await economyData.save();

    let card = await GamblingCardModel.findOne({ id: interaction.user.id });
    if (card) {
      card.rt.bets += amount;
      card.rt.total += 1;
      card.save().catch((err: any) => console.log(err));
    }

    //Monthly Mission Section================
    if (bet.type === "number" && bet.number == 7 && bet.amount > 999) {
      //MRTW7-----
      let monthlyDataW = await userMonthly.findOne({ id: interaction.user.id });
      if (!monthlyDataW) {
        await userMonthly.create({
          id: interaction.user.id,
          rt7: { value: 1, prize: false, prizePlus: false },
        });
      } else {
        if (monthlyDataW.rt7.value > 0) {
          monthlyDataW.rt7.value += 1;
        } else {
          monthlyDataW.rt7.value = 1;
        }
        monthlyDataW.save().catch((err: any) => console.log(err));
      }
    }
    //Monthly END=================================================================
  }
}
