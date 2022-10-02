import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import findByUserId from "../../../database/functions/economy/findUserById";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import { GamblingCardModel } from "../../../database/models/GamblingCardModel";
import userMonthly from "../../../database/models/UserMonthlyMissionsModel";

//const slotSymbols = ['🍉', '7️⃣', '🍇', '🔷', '🔔', '🍒', '🍋', '🍀', '🪙', '🍎', '👑'];
//const slotSymbols = ['<:Slots8:822451191710613524>', '<:Slots6:822451245200572446>', '<:Slots5:822451260828549161>', '<:Slots4:822451280420012073>', '<:Slots3:822451297889550336>', '<:Slots1:822451331343974410>', '<:Slots2:822451320111235072>', '<:Slots7:822451231704350760>'];
//const slotSymbols = ['<:Slots8:822451191710613524>', '<:Slots6:822451245200572446>', '<:Slots5:822451260828549161>', '<:Slots4:822451280420012073>','<:Slots2:822451320111235072>', '<:Slots7:822451231704350760>'];
const slotSymbols = [
  "<:EricaHmmm:899744430372814918>",
  "<:EricaEvilPlotting:897841584647847986>",
  "<:EricaHeartEyes:897841580654878760>",
  "<:EricaFacePalm:899744428321816576>",
  "<:EricaSobbing:897930587518677002>",
];
function randomSymbol() {
  return slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
}

@ApplyOptions<Command.Options>({
  name: "slotmachine",
  description: "Gamble your money away on the Slot-machine",
})
export class SlotMachineCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addStringOption((option) =>
          option
            .setName("bet")
            .setDescription("Your bet? all or a number")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(
    interaction: Command.ChatInputInteraction & {
      cardResult: boolean | undefined;
    }
  ) {
    let all = (await findByUserId(interaction.user.id)).coins;
    let money = parseInt(interaction.options.getString("bet") as string);
    if (!Number(interaction.options.getString("bet") as string))
      money = Number(all);

    if (isNaN(Number(money)) || !Number.isInteger(Number(money)))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(
              "Invalid bet format, make sure you provide an money of coins which is not a decimal value."
            ),
        ],
      });

    if (Number.isInteger(Number(money)) && Number(money) < 50)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(
              "You must bet 50 or more coins in a Slot Machine Game <a:exclamation:741988026296696872>"
            ),
        ],
      });

    if ((await findByUserId(interaction.user.id)).coins < Number(money))
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

    // run this when user executes command
    let wins = 0;
    let response = "";
    let slots = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    for (let i = 0; i < slots.length; i++) {
      for (let j = 0; j < slots[i].length; j++) {
        slots[i][j] = randomSymbol();
      }
    }

    let response2 = slots.map((row) => row.join("│")).join("\n");

    for (const row of slots) {
      if (new Set(row).size === 1) wins++;
    }

    if (new Set([slots[0][0], slots[1][1], slots[2][2]]).size === 1) wins++;
    if (new Set([slots[0][2], slots[1][1], slots[2][0]]).size === 1) wins++;
    if (new Set([slots[0][0], slots[1][0], slots[2][0]]).size === 1) wins++;
    if (new Set([slots[0][1], slots[1][1], slots[2][1]]).size === 1) wins++;
    if (new Set([slots[0][2], slots[1][2], slots[2][2]]).size === 1) wins++;

    var winningAmount;
    if (wins > 2) {
      interaction.cardResult = true;
      winningAmount = money * wins * 3;
      response += `\n${interaction.user} Holy shit, what are the odds...\n**\`${winningAmount}\`** were added to your wallet <a:WavingSomeCash:822490680031051807>`;
    } else if (wins == 2) {
      interaction.cardResult = true;
      winningAmount = money * wins * 2;
      response += `\n${interaction.user} Double trouble! Well not really trouble. The Good kind of trouble.\n**\`${winningAmount}\`** were added to your wallet <a:WavingSomeCash:822490680031051807> `;
    } else if (wins == 1) {
      interaction.cardResult = true;
      winningAmount = money * wins * 2;
      response += `\n${interaction.user}👑 won! 🤩 **\`${winningAmount}\`** were added to their wallet <a:WavingSomeCash:822490680031051807>`;
    } else {
      interaction.cardResult = false;
      winningAmount = -money;
      response += `\n${interaction.user} lost their bet of **\`${money}\`**😵`;
    }

    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(response2)
          .setColor("RANDOM")
          .setAuthor({
            name: `Slot Machine`,
            iconURL: `https://i.imgur.com/yJF50QU.gif`,
          }),
      ],
    });
    await interaction.editReply({ content: response, embeds: [] });

    await Eco.updateOne(
      { id: interaction.user.id },
      { $inc: { coins: winningAmount } }
    );

    //Monthly Mission Section================
    if (wins > 0) {
      let monthlyData = await userMonthly.findOne({ id: interaction.user.id });
      if (!monthlyData) {
        await userMonthly.create({
          id: interaction.user.id,
          slots: { value: 1, wins: 1, loss: 0, prize: false, prizePlus: false },
        });
      } else {
        if (monthlyData.slots.value > 0) {
          monthlyData.slots.value += 1;
        } else {
          monthlyData.slots.value = 1;
        }
        if (monthlyData.slots.wins > 0) {
          monthlyData.slots.wins += 1;
        } else {
          monthlyData.slots.wins = 1;
        }
        await monthlyData.save().catch((err: any) => console.log(err));
      }
    }
    //Monthly END=================================================================
    //return;

    //GAMBLING CLUB STUFF===========
    const card = await GamblingCardModel.findOne({ id: interaction.user.id });
    if (card) {
      if (interaction.cardResult == true) {
        card.slots.wins += 1;
        card.slots.winnings += winningAmount;
      }
      if (interaction.cardResult == false) {
        card.slots.loss += 1;
        card.slots.losses += money;
      }
      card.slots.total += 1;
      card.slots.bets += money;

      card.save().catch((err: any) => console.log(err));
    }
    //GCC END============================================================================
  }
}
