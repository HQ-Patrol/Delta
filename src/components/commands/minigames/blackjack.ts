import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import { GamblingCardModel } from "../../../database/models/GamblingCardModel";
import userWeekly from "../../../database/models/UserWeeklyMissionsModel";
import userMonthly from "../../../database/models/UserMonthlyMissionsModel";
// @ts-ignore
import blackjack from "discord-blackjack";
import { attemptExpand } from "../../../utilities/helpers";

@ApplyOptions<Command.Options>({
  name: "blackjack",
  description:
    "Blackjack requires the player to get a sum total of 21 in their hands to get the Victory",
})
export class BlackJackCommand extends Command {
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

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    await interaction.deferReply();

    if (!interaction.options.getString("bet"))
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription('Specify your bet or type "all/half"!'),
        ],
      });

    // We use raw databases around here, no fuckin utility help.
    let myself = await Eco.findOne({
      id: interaction.user.id,
    });
    if (!myself) {
      myself = new Eco({
        id: interaction.user.id,
        lastUse: Date.now(),
        coins: 0,
        bank: 0,
        xp: 0,
        level: 1,
        items: [],
        bracket: 1,
      });

      await myself.save();
    }

    // Check if user is broke..
    if (myself.coins <= 0)
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Either you're broke or in debt. Pick a struggle."),
        ],
      });

    // Parse
    let amount = interaction.options.getString("bet") as any;

    // Parse
    const attempt = attemptExpand(amount as string);
    if (attempt && Number.isInteger(attempt)) {
      amount = attempt;
    } else if (amount.toLowerCase() === "half") {
      amount = ~~(myself.coins / 2);
    } else if (
      amount.toLowerCase() === "max" ||
      amount.toLowerCase() === "all"
    ) {
      amount = myself.coins;
    } else if (isNaN(parseInt(amount))) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "Please provide a valid amount <a:exclamation:741988026296696872>"
            ),
        ],
      });
    } else {
      amount = parseInt(amount);
    }

    // @ts-ignore
    if (isNaN(amount)) {
      // just in case
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "Please provide a valid amount <a:exclamation:741988026296696872>"
            ),
        ],
      });
    }

    // 50 coin
    // @ts-ignore
    if (amount < 50)
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(
              "**You must bet atleast 50 or more coins** <a:exclamation:741988026296696872>"
            ),
        ],
      });

    // For that one guy
    if (myself.coins < (amount as any))
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Insufficient Wallet Balance")
            .setDescription(
              "<a:RedTick:736282199258824774> How do you plan to flip more than you have in your wallet? 🥱"
            ),
        ],
      });

    let denomination;
    let response;
    let won;

    await Eco.updateOne(
      { id: interaction.user.id },
      { $inc: { coins: -amount } }
    );

    const game = await blackjack(interaction);
    switch (game.result) {
      case "WIN":
        denomination = 2 * amount;
        response = `${interaction.user}'s Winning amount: **\`${denomination}\`** was added to their wallet <:EricaHeartEyes:897841580654878760>`;
        won = true;
        break;
      case "TIE":
        denomination = amount;
        won = false;
        //return;
        break;
      case "LOSE":
        denomination = 0;
        response = `${interaction.user}'s Losses: **\`${amount}\`** were deducted from your Wallet <:EricaSobbing:897930587518677002>`;
        won = false;
        break;
      case "DOUBLE WIN":
        denomination = amount * 3;
        response = `${interaction.user}'s DOUBLE Winning amount: **\`${denomination}\`** was added to their wallet <:EricaHeartEyes:897841580654878760>`;
        won = false;
        break;
      case "DOUBLE LOSE":
        denomination = -amount;
        response = `${interaction.user}'s DOUBLE Losses: **\`${denomination}\`** were deducted from your Wallet <:EricaSobbing:897930587518677002>`;
        won = false;
        break;
      case "CANCEL":
        denomination = 0;
        response = `Match Forfeit! ${interaction.user} lost: **\`${amount}\`** <:BruhMoji:784018093595820033>`;
        won = false;
        break;
      case "TIMEOUT":
        denomination = 0;
        response = `Match Timed-out! ${interaction.user} lost: **\`${amount}\`** <:BruhMoji:784018093595820033>`;
        won = false;
        break;
      default:
        return;
    }

    await interaction.followUp({ content: response });

    // save a query
    if (denomination !== 0) {
      await Eco.updateOne(
        { id: interaction.user.id },
        { $inc: { coins: denomination } }
      );
    }

    //Weekly Mission Section================
    // @ts-ignore
    if (amount > 999 && won == true) {
      const weeklyDataW = await userWeekly.findOne({ id: interaction.user.id });
      if (!weeklyDataW) {
        await userWeekly.create({
          id: interaction.user.id,
          bj: { value: 1, wins: 1, loss: 0, prize: false, prizePlus: false },
        });
      } else {
        if (weeklyDataW.bj.value > 0) {
          weeklyDataW.bj.value += 1;
        } else {
          weeklyDataW.bj.value = 1;
        }
        if (weeklyDataW.bj.wins > 0) {
          weeklyDataW.bj.wins += 1;
        } else {
          weeklyDataW.bj.wins = 1;
        }
        weeklyDataW.save().catch((err: any) => console.log(err));
      }
    }
    //Weekly END=================================================================

    //Monthly Mission Section================
    // @ts-ignore
    if (amount > 4999 && won == false) {
      const monthlyDataL = await userMonthly.findOne({
        id: interaction.user.id,
      });
      if (!monthlyDataL) {
        await userMonthly.create({
          id: interaction.user.id,
          bj: { value: 1, wins: 0, loss: 1, prize: false, prizePlus: false },
        });
      } else {
        if (monthlyDataL.bj.value > 0) {
          monthlyDataL.bj.value += 1;
        } else {
          monthlyDataL.bj.value = 1;
        }
        if (monthlyDataL.bj.loss > 0) {
          monthlyDataL.bj.loss += 1;
        } else {
          monthlyDataL.bj.loss = 1;
        }
        monthlyDataL.save().catch((err: any) => console.log(err));
      }
    }
    //Monthly END=================================================================

    //GAMBLING CLUB STUFF===========
    const card = await GamblingCardModel.findOne({ id: interaction.user.id });
    if (card) {
      if (won == true) {
        card.bj.wins += 1;
        card.bj.winnings += 2 * Number(amount);
      }
      if (won == false) {
        card.bj.loss += 1;
        card.bj.losses += Number(amount);
      }
      card.bj.total += 1;
      card.bj.bets += Number(amount);

      card.save().catch((err: any) => console.log(err));
    }
    return;
    //GCC END============================================================================
  }
}

/*
NODE MODULE EDITS
const shuffle = require("shuffle-array")
const games = new Set();

    // * @param {Discord.Message} message The Message Object sent by the user
    // * @param {Discord} Discord The Discord object
    // * @param {object} options The options object (optional)
    // * @returns String
    // * @async
    // * @example
    // * const Discord = require("discord.js")
    // * const blackjack = require("discord-blackjack")
    // * const client = new Discord.Client(ws: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"])
    // * const prefix = "-"
    // * const token = "TOKEN_GOES_HERE"
    // * 
    // * client.on("ready", () => {
    // *   console.log("Bot has logged in!")
    // * })
    // * 
    // * client.on("message", async message => {
    // *   if (message.author.bot || !message.content.startsWith("prefix")) return
    // * 
    // *   if (message.content == `${prefix}blackjack` || message.content == `${prefix}bj`) {
    // *       let game = await blackjack(message, client)
    // *       let result = game.result
    // *       if (result == "Win") {
    // *           // do win stuff here
    // *       } else if (result == "Tie") {
    // *           // do tie stuff here
    // *       } else if (result == "Lose") {
    // *           // do lose stuff here
    // *       } else if (result == "Double Win") {
    // *           // do double-down here
    // *       }
    // *   }
    // * })
    // * 
    // * client.login(token)


module.exports = async (message, Discord, options) => {
    let normalembed = false
    let copiedEmbed = {
        content: "",
        value: ""
    }
    let method = "None"
    if (!message) throw new Error("[DETAILS_NOT_PROVIDED]: The Message Object was not provided!")
    if (!Discord) throw new Error("[DETAILS_NOT_PROVIDED]: The Discord Object was not provided!")
    if (!Discord.version) throw new Error("[INVALID_DETAILS]: The Discord Object was invalid!")
    if (Discord.version.split(".")[0] < "13") throw new TypeError("[WRONG_USAGE]: You need to at least update your discord.js module to version 13.0.0. To keep using v12, downgrade to version 2.0.4 by using `npm install discord-blackjack@2.0.4`")
    if (!options) options = {}
    if (typeof options != "object") throw new Error("[INVALID_DETAILS]: Options is expected to be an object!")
    if (!options.resultEmbed && options.resultEmbed != false) options.resultEmbed = true
    if (!options.normalEmbed && options.normalEmbed != false) options.normalEmbed = true
    if (!options.doubledown && options.doubledown != false) options.doubledown = true
    if (!options.split && options.split != false) options.split = true
    if (options.normalEmbed == false) {
        if (!options.normalEmbedContent) throw new Error("[DETAILS_NOT_PROVIDED]: The Embed object was not provided!")
        normalembed = options.normalEmbedContent
    }
    if (!options.button && options.buttons != false) options.buttons = true
    if (!message.content && !message.commandName) throw new Error("[INVALID_DETAILS]: The Message Object was invalid!")
    if (!message.guild || !message.guild.me) throw new TypeError("[WRONG_USAGE]: This cannot be used in DMs!")

    if (games.has(message.member.id)) {
        return message.channel.send("You are already playing a game!")
    }
    games.add(message.member.id)

    if (message.replied) {
        message.reply({
            embeds: [new Discord.MessageEmbed().setTitle("Starting game...").setDescription("The blackjack game should start in a moment...").setColor("RANDOM")],
            ephemeral: true
        })
    }

    try {
        let DECK = [
            { suit: 'clubs', rank: 'A', value: [1, 11], emoji: "♣️" },
            { suit: 'clubs', rank: '2', value: 2, emoji: "♣️" },
            { suit: 'clubs', rank: '3', value: 3, emoji: "♣️" },
            { suit: 'clubs', rank: '4', value: 4, emoji: "♣️" },
            { suit: 'clubs', rank: '5', value: 5, emoji: "♣️" },
            { suit: 'clubs', rank: '6', value: 6, emoji: "♣️" },
            { suit: 'clubs', rank: '7', value: 7, emoji: "♣️" },
            { suit: 'clubs', rank: '8', value: 8, emoji: "♣️" },
            { suit: 'clubs', rank: '9', value: 9, emoji: "♣️" },
            { suit: 'clubs', rank: '10', value: 10, emoji: "♣️" },
            { suit: 'clubs', rank: 'J', value: 10, emoji: "♣️" },
            { suit: 'clubs', rank: 'Q', value: 10, emoji: "♣️" },
            { suit: 'clubs', rank: 'K', value: 10, emoji: "♣️" },

            { suit: 'diamonds', rank: 'A', value: [1, 11], emoji: "️️️️️️♦️" },
            { suit: 'diamonds', rank: '2', value: 2, emoji: "♦️" },
            { suit: 'diamonds', rank: '3', value: 3, emoji: "♦️" },
            { suit: 'diamonds', rank: '4', value: 4, emoji: "♦️" },
            { suit: 'diamonds', rank: '5', value: 5, emoji: "♦️" },
            { suit: 'diamonds', rank: '6', value: 6, emoji: "♦️" },
            { suit: 'diamonds', rank: '7', value: 7, emoji: "♦️" },
            { suit: 'diamonds', rank: '8', value: 8, emoji: "♦️" },
            { suit: 'diamonds', rank: '9', value: 9, emoji: "♦️" },
            { suit: 'diamonds', rank: '10', value: 10, emoji: "♦️" },
            { suit: 'diamonds', rank: 'J', value: 10, emoji: "♦️" },
            { suit: 'diamonds', rank: 'Q', value: 10, emoji: "♦️" },
            { suit: 'diamonds', rank: 'K', value: 10, emoji: "♦️" },

            { suit: 'hearts', rank: 'A', value: [1, 11], emoji: "♥️" },
            { suit: 'hearts', rank: '2', value: 2, emoji: "♥️" },
            { suit: 'hearts', rank: '3', value: 3, emoji: "♥️" },
            { suit: 'hearts', rank: '4', value: 4, emoji: "♥️" },
            { suit: 'hearts', rank: '5', value: 5, emoji: "♥️" },
            { suit: 'hearts', rank: '6', value: 6, emoji: "♥️" },
            { suit: 'hearts', rank: '7', value: 7, emoji: "♥️" },
            { suit: 'hearts', rank: '8', value: 8, emoji: "♥️" },
            { suit: 'hearts', rank: '9', value: 9, emoji: "♥️" },
            { suit: 'hearts', rank: '10', value: 10, emoji: "♥️" },
            { suit: 'hearts', rank: 'J', value: 10, emoji: "♥️" },
            { suit: 'hearts', rank: 'Q', value: 10, emoji: "♥️" },
            { suit: 'hearts', rank: 'K', value: 10, emoji: "♥️" },

            { suit: 'spades', rank: 'A', value: [1, 11], emoji: "♠️" },
            { suit: 'spades', rank: '2', value: 2, emoji: "♠️" },
            { suit: 'spades', rank: '3', value: 3, emoji: "♠️" },
            { suit: 'spades', rank: '4', value: 4, emoji: "♠️" },
            { suit: 'spades', rank: '5', value: 5, emoji: "♠️" },
            { suit: 'spades', rank: '6', value: 6, emoji: "♠️" },
            { suit: 'spades', rank: '7', value: 7, emoji: "♠️" },
            { suit: 'spades', rank: '8', value: 8, emoji: "♠️" },
            { suit: 'spades', rank: '9', value: 9, emoji: "♠️" },
            { suit: 'spades', rank: '10', value: 10, emoji: "♠️" },
            { suit: 'spades', rank: 'J', value: 10, emoji: "♠️" },
            { suit: 'spades', rank: 'Q', value: 10, emoji: "♠️" },
            { suit: 'spades', rank: 'K', value: 10, emoji: "♠️" },
        ];

        let RESULTS = "Unknown"

        let NEWDECKS = shuffle(DECK)

        // all the variables
        let addco = ""
        for (let a = 0; a < NEWDECKS.length; a++) {
            if (NEWDECKS[a].rank == "A") {
                NEWDECKS[a].value = 11
            }
        }

        if (NEWDECKS[0].rank == "A") {
            addco = "Soft "
            if (NEWDECKS[2].rank == "A") {
                NEWDECKS[2].value = 1
            }
        }

        if (NEWDECKS[2].rank == "A") {
            addco = "Soft "
        }

        if (NEWDECKS[1].rank == "A") {
            if (NEWDECKS[3].rank == "A") {
                NEWDECKS[3].value = 1
            }
        }


        let startAt = 5

        let yourdeck = [NEWDECKS[0], NEWDECKS[2]]
        let yourrank = [NEWDECKS[0].rank, NEWDECKS[2].rank]
        let youremoji = [NEWDECKS[0].emoji, NEWDECKS[2].emoji]
        let yourcontent = [`${NEWDECKS[0].emoji} ${NEWDECKS[0].rank}`, `${NEWDECKS[2].emoji} ${NEWDECKS[2].rank}`]
        let value = NEWDECKS[0].value + NEWDECKS[2].value
        let dealerdeck = [NEWDECKS[1], NEWDECKS[3]]
        let dealerrank = [NEWDECKS[1].rank, NEWDECKS[3].rank]
        let dealeremoji = [NEWDECKS[1].emoji, NEWDECKS[3].emoji]
        let dealercontent = [`${NEWDECKS[1].emoji} ${NEWDECKS[1].rank}`, `${NEWDECKS[3].emoji} ${NEWDECKS[3].rank}`]
        let dvalue = dealerdeck[0].value + dealerdeck[1].value
        //let usertag = message.author?.tag || message.user.tag
        //let avatar = message.author?.displayAvatarURL({dynamic:true}) || message.user.displayAvatarURL({dynamic:true})

        if (options.normalEmbed == true) {
            normalembed = new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
                .setColor("RANDOM").setThumbnail(`https://i.imgur.com/WxBzVX3.gif`)
                .addField(`Your Hand`, `Cards: [\`${yourcontent.join("\`](https://patrolbot.xyz) [\`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``, true)
                .addField(`Erica's Hand`, `Cards: [\`${dealerdeck[0].emoji} ${dealerdeck[0].rank}\`](https://patrolbot.xyz) \` ? \`\nTotal: \` ? \``, true)
                .setTitle(`Game of Blackjack 🃏`)
                .setFooter({text: "Type E or End to stop the game"})
        } else {
            normalembed.fields[0].value = normalembed.fields[0].value.replace(`{yourcontent}`, `[\`${yourcontent.join("\`](https://patrolbot.xyz) [\`")}\`](https://patrolbot.xyz)`).replace("{yvalue}", `${addco}${value}`)
            normalembed.fields[1].value = normalembed.fields[1].value.replace(`{dcontent}`, `[\`${dealerdeck[0].emoji} ${dealerdeck[0].rank}\`](https://patrolbot.xyz)   \` ? \``).replace("{dvalue}", `?`)
            copiedEmbed.content = `[\`${yourcontent.join("\`](https://patrolbot.xyz) [\`")}\`](https://patrolbot.xyz)`
            copiedEmbed.value = `${addco}${value}`
        }

        let winembed = new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
            .setColor("#008800").setThumbnail(`https://i.imgur.com/WxBzVX3.gif`)
            .addField(`Your Hand`, `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``, true)
            .addField(`Erica's Hand`, `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``, true)
            .setTitle(`Result: WON ✅\n`)

        let loseembed = new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
            .setColor("#880000").setThumbnail(`https://i.imgur.com/WxBzVX3.gif`)
            .addField(`Your Hand`, `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}](https://patrolbot.xyz)\`\nTotal: \`${addco}${value}\``, true)
            .addField(`Erica's Hand`, `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``, true)
            .setTitle(`Result: LOST ❌\n`)

        let tieembed = new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
            .setColor("#888800").setThumbnail(`https://i.imgur.com/WxBzVX3.gif`)
            .addField(`Your Hand`, `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}](https://patrolbot.xyz)\`\nTotal: \`${addco}${value}\``, true)
            .addField(`Erica's Hand`, `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``, true)
            .setTitle(`Result: TIE 😐`)

        let cancelembed = new Discord.MessageEmbed()
            //.setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
            .setColor("#FFFFF0")
            .setTitle("♠️ GAME CANCELED ‼️")
            //.setFooter({text: "Auhh, please stay next time!"})
            //.setDescription("Game has succesfully been canceled!")

        let noResEmbed = new Discord.MessageEmbed()
            .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
            .setTitle(`Game ENDED`)
            .setDescription(`**${message.author?.username || message.user.username}, your Game has Ended due to 30 seconds of Inactivity.**`)
            .setColor("RANDOM")

        if (options.buttons == true) {
            if (options.normalEmbed == true) {
                normalembed = new Discord.MessageEmbed()
                    .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
                    .setColor("RANDOM").setThumbnail(`https://i.imgur.com/WxBzVX3.gif`)
                    .addField(`Your Hand`, `Cards: [\`${yourcontent.join("\`](https://patrolbot.xyz) [\`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``, true)
                    .addField(`Erica's Hand`, `Cards: [\`${dealerdeck[0].emoji} ${dealerdeck[0].rank}\`](https://patrolbot.xyz) \` ? \`\nTotal: \` ? \``, true)
                    .setTitle(`Game of Blackjack`)
            }
        }

        let hitButton = new Discord.MessageButton()
            .setLabel("Hit")
            .setStyle("PRIMARY")
            .setCustomId("hitbtn-discordblackjack")

        let standButton = new Discord.MessageButton()
            .setLabel("Stand")
            .setStyle("PRIMARY")
            .setCustomId("standbtn-discordblackjack")

        let doubledownButton = new Discord.MessageButton()
            .setLabel("Double down")
            .setStyle("PRIMARY")
            .setCustomId("ddbtn-discordblackjack")

        let splitButton = new Discord.MessageButton()
            .setLabel("Split")
            .setStyle("PRIMARY")
            .setCustomId("splitbtn-discordblackjack")

        let cancelButton = new Discord.MessageButton()
            .setLabel("Cancel")
            .setStyle("DANGER")
            .setCustomId("cancelbtn-discordblackjack")

        let row = new Discord.MessageActionRow().addComponents(hitButton).addComponents(standButton)
        let row2 = new Discord.MessageActionRow().addComponents(cancelButton)

        let normalcontent = `Type \`h\` to draw a card or type \`s\` to stand.`
        let doubledown = `Type \`h\` to draw a card, type \`s\` to stand or type \`d\` to double down.`
        let split = `Type \`h\` to draw a card, type \`s\` to stand or \`split\` to split`
        let content = normalcontent

        let answers1 = ["h", "hit", "hi", "e", "en", "end", "s", "stand", "st", "sta", "stan"] // normalcontent
        let answers2 = ["h", "hit", "hi", "e", "en", "end", "s", "stand", "st", "sta", "stan", "d", "dd", "double-down", "double down"] // doubledown
        let answers3 = ["h", "hit", "hi", "e", "en", "end", "s", "stand", "st", "sta", "stan", "sp", "split", "spl", "spli"] // split

        let filter1 = m => m.member.id == message.member.id && answers1.includes(m.content?.toLowerCase()) // answers1
        let filter2 = m => m.member.id == message.member.id && answers2.includes(m.content?.toLowerCase()) // answers2
        let filter3 = m => m.member.id == message.member.id && answers3.includes(m.content?.toLowerCase()) // answers3
        let filter = filter1

        let btnfilter = i => { return [
            "hitbtn-discordblackjack", 
            "standbtn-discordblackjack", 
            "ddbtn-discordblackjack", 
            "splitbtn-discordblackjack",
            "cancelbtn-discordblackjack"
        ].includes(i.customId) && i.user.id == message.member.id}

        let doubledtrue = false

        let responsenow = "h"

        if (value == 21) {
            responsenow = "s"
            if (dvalue == 21) {
                if (options.resultEmbed == true) {
                    message.channel.send({ embeds: [tieembed] })
                }
                games.delete(message.member.id)
                method = "Tie"
                RESULTS = "Tie"
            } else {
                if (options.resultEmbed == true) {
                    message.channel.send({ embeds: [winembed] })
                }
                games.delete(message.member.id)
                method = "Blackjack"
                RESULTS = "Win"
            }
        }

        if (addco != "Soft ") {
            if (value == 9 || (value == 10 || value == 11 && dealerdeck[1].value < 10)) {
                content = doubledown
                filter = filter2
                row.addComponents(doubledownButton)
                
            } 
            if (yourdeck[0].rank == yourdeck[1].rank) {
                content = split
                filter = filter3
                row.addComponents(splitButton)
            }
        }

        if (options.buttons == true) {
            if (RESULTS == "Unknown") {
                let btnmsg = await message.channel.send({ embeds: [normalembed], components: [row, row2] })
                normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                row = new Discord.MessageActionRow().addComponents(hitButton).addComponents(standButton)
                await btnmsg.awaitMessageComponent({ filter: btnfilter, time: 30000 }).then(
                    async i => {
                        i.deferUpdate()
                        await btnmsg.delete().catch(() => null)
                        if (i.customId.startsWith("hit")) {
                            let dealCard = NEWDECKS[startAt - 1]
                            yourdeck.push(dealCard)
                            if (dealCard.rank == "A") {
                                if (yourrank.includes("A")) {
                                    dealCard.value = 1
                                } else {
                                    dealCard.value = 11
                                    addco = "Soft "
                                }
                            }
                            value = value + dealCard.value
                            yourcontent.push(`${dealCard.emoji} ${dealCard.rank}`)
                            yourrank.push(dealCard.rank)
                            youremoji.push(dealCard.emoji)
                            let endtrue = false
                            if (value >= 21) {
                                if (addco == "Soft ") {
                                    addco = ""
                                    for (let e = 0; e < yourdeck.length; e++) {
                                        if (yourdeck[e].rank == "A") {
                                            yourdeck[e].value = 1
                                            value = value - 10
                                        }
                                    }
                                } else {
                                    if (dealCard.rank != "A") {
                                        endtrue = true
                                        responsenow = "s"
                                    } else {
                                        addco = "Soft "
                                    }
                                }
                            }

                            if (endtrue == false) {
                                if (value >= 21) {
                                    responsenow = "s"
                                } else {
                                    responsenow = "h"
                                }
                            }

                            if (responsenow != "s") {
                                if (options.normalEmbed == true) {
                                    normalembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                                } else {
                                    normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.content, `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`).replace(`{yvalue}`, `${addco}${value}`)
                                    copiedEmbed.content = `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`
                                    copiedEmbed.value = `${addco}${value}`
                                }
                                btnmsg = await message.channel.send({ embeds: [normalembed], components: [row, row2] })
                                normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                            }
                            startAt++



                        } else if (i.customId.startsWith("stand")) {
                            responsenow = "s"
                        } else if (i.customId.startsWith("dd")) {
                            responsenow = "d"
                        } else if (i.customId.startsWith("split")) {
                            responsenow = "split"
                        } else {
                            responsenow = "cancel"
                        }
                    }
                ).catch(() => {
                    responsenow = "timeout"
                })

                while (responsenow == "d") {
                    doubledtrue = true
                    let dealCard = NEWDECKS[startAt - 1]
                    yourdeck.push(dealCard)
                    if (dealCard.rank == "A") {
                        if (yourrank.includes("A")) {
                            dealCard.value = 1
                        } else {
                            dealCard.value = 11
                        }
                    }
                    yourcontent.push(`${dealCard.emoji} ${dealCard.rank}`)
                    yourrank.push(dealCard.rank)
                    youremoji.push(dealCard.emoji)
                    value = value + dealCard.value
                    responsenow = "s"
                }

                while (responsenow == "split") {
                    let deletedi = yourdeck.pop()
                    value = value - deletedi.value
                    yourrank.pop()
                    youremoji.pop()
                    yourcontent.pop()
                    if (options.normalEmbed == true) {
                        normalembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                    } else {
                        normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.content, `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`).replace(`{yvalue}`, `${addco}${value}`)
                        copiedEmbed.content = `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`
                        copiedEmbed.value = `${addco}${value}`
                    }
                    btnmsg = await message.channel.send({ embeds: [normalembed], components: [row, row2] })
                    normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                    responsenow = "h"
                }

                while (responsenow == "h") {
                    await btnmsg.awaitMessageComponent({ filter: btnfilter, time: 30000 })
                        .then(async interaction => {
                            interaction.deferUpdate()
                            await btnmsg.delete().catch(() => null)
                            if (interaction.customId.startsWith("hit")) {
                                let dealCard = NEWDECKS[startAt - 1]
                                yourdeck.push(dealCard)
                                if (dealCard.rank == "A") {
                                    if (yourrank.includes("A")) {
                                        dealCard.value = 1
                                    } else {
                                        dealCard.value = 11
                                        addco = "Soft "
                                    }
                                }
                                value = value + dealCard.value
                                yourcontent.push(`${dealCard.emoji} ${dealCard.rank}`)
                                yourrank.push(dealCard.rank)
                                youremoji.push(dealCard.emoji)
                                let endtrue = false

                                if (value >= 21) {
                                    if (addco == "Soft ") {
                                        addco = ""
                                        for (let usu = 0; usu < yourdeck.length; usu++) {
                                            if (yourdeck[usu].rank == "A") {
                                                yourdeck[usu].value = 1
                                                value = value - 10
                                            }
                                        }
    
                                    } else {
                                        if (dealCard.rank != "A") {
                                            endtrue = true
                                            responsenow = "s"
                                        } else {
                                            addco = "Soft "
                                        }
                                    }
                                }
                                if (endtrue == false) {
                                    if (value >= 21) {
                                        responsenow = "s"
                                    } else {
                                        responsenow = "h"
                                    }
                                }

                                if (responsenow != "s") {
                                    if (options.normalEmbed == true) {
                                        normalembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                                    } else {
                                        normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.content, `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`).replace(`{yvalue}`, `${addco}${value}`)
                                        copiedEmbed.content = `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`
                                        copiedEmbed.value = `${addco}${value}`
                                    }
                                    btnmsg = await message.channel.send({ embeds: [normalembed], components: [row, row2] })
                                    normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                                }
                                startAt++

                            } else if (interaction.customId.startsWith("stand")) {
                                responsenow = "s"
                            } else {
                                responsenow = "cancel"
                            }
                        })
                        .catch(() => {
                            responsenow = "timeout"
                        })
                }

                while (responsenow == "s") {

                    games.delete(message.member.id)
                    while (dvalue < 17) {
                        let newcard = dealerdeck.push(NEWDECKS[startAt - 1])
                        dealercontent.push(`${NEWDECKS[startAt - 1].emoji} ${NEWDECKS[startAt - 1].rank}`)
                        dealerrank.push(NEWDECKS[startAt - 1].rank)
                        dealeremoji.push(NEWDECKS[startAt - 1].emoji)
                        if (newcard.rank == "A") {
                            if (dealerrank.includes("A")) {
                                NEWDECKS[startAt - 1].value = 1
                            } else {
                                NEWDECKS[startAt - 1].value = 11
                            }
                        }
                        dvalue = dvalue + NEWDECKS[startAt - 1].value
                        if (dvalue > 21 && dealerrank.includes("A")) {
                            let unu = 0
                            dealerdeck.forEach(e => {
                                if (e.rank == "A") {
                                    dealerdeck[unu].value = 1
                                }
                                unu++
                            })
                        }
                        startAt++
                    }
                    responsenow = "INVALID"

                    if (value > 21 || (dvalue <= 21 && value < dvalue)) {
                        if (value > 21) {
                            method = "Busted"
                        } else if (dvalue == 21) {
                            method = "Dealer reached 21"
                        } else {
                            method = "Dealer had more"
                        }
                        loseembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                        loseembed.fields[1].value = `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``
                        if (options.resultEmbed == true) {
                            message.channel.send({ embeds: [loseembed] })
                        }
                        RESULTS = "Lose"
                        if (doubledtrue == true) {
                            RESULTS = "Double Lose"
                        }
                    } else if (value == 21 || value > dvalue || dvalue > 21) {
                        if (value == 21) {
                            method = "Blackjack"
                        } else if (dvalue > 21) {
                            method = "Dealer Bust"
                        } else {
                            method = "Player had more"
                        }
                        winembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                        winembed.fields[1].value = `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``
                        if (options.resultEmbed == true) {
                            message.channel.send({ embeds: [winembed] })
                        }
                        RESULTS = "Win"
                        if (doubledtrue == true) {
                            RESULTS = "Double Win"
                        }
                    } else if (value == dvalue) {
                        method = "Tie"
                        tieembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                        tieembed.fields[1].value = `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``
                        if (options.resultEmbed == true) {
                            message.channel.send({ embeds: [tieembed] })
                        }
                        RESULTS = "Tie"
                    } else {
                        let errEmbed = new Discord.MessageEmbed()
                            .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
                            .setTitle("ERROR ‼️")
                            .setDescription("Uh oh! An error occured! Please join our server by clicking [here](https://discord.gg/HQ)")
                            .setFooter({text: "Oops"})
                            .setColor("#FF0000")
                        if (options.resultEmbed == true) {
                            message.channel.send({ embeds: [errEmbed] })
                        }
                        RESULTS = "ERROR"
                    }
                    responsenow = "ENDED"

                }

                

                while (responsenow == "cancel") {
                    games.delete(message.member.id)
                    if (options.resultEmbed == true) {
                        message.channel.send({ embeds: [cancelembed] })
                    }
                    responsenow = "INVALID"
                    RESULTS = "Cancel"
                }

                while (responsenow == "timeout") {
                    games.delete(message.member.id)
                    if (options.resultEmbed == true) {
                        message.channel.send({ embeds: [noResEmbed] })
                    }
                    RESULTS = "Timeout"
                    responsenow = "INVALID"
                }
                
            }
        } else {
            if (RESULTS == "Unknown") {
                let ori = message.channel.send({ content: content, embeds: [normalembed] })
                normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000 }).then(
                    async allresponses => {
                        if (!allresponses.size) {
                            responsenow = "timeout"
                        } else {
                            let theanswer = String(allresponses.first()).toLowerCase()
                            if (["h", "hit", "hi"].includes(theanswer)) {
                                let dealCard = NEWDECKS[startAt - 1]
                                yourdeck.push(dealCard)
                                if (dealCard.rank == "A") {
                                    if (yourrank.includes("A")) {
                                        dealCard.value = 1
                                    } else {
                                        dealCard.value = 11
                                        addco = "Soft "
                                    }
                                }
                                value = value + dealCard.value
                                yourcontent.push(`${dealCard.emoji} ${dealCard.rank}`)
                                yourrank.push(dealCard.rank)
                                youremoji.push(dealCard.emoji)
                                let endtrue = false
                                if (value >= 21) {
                                    if (addco == "Soft ") {
                                        addco = ""
                                        for (let e = 0; e < yourdeck.length; e++) {
                                            if (yourdeck[e].rank == "A") {
                                                yourdeck[e].value = 1
                                                value = value - 10
                                            }
                                        }
                                    } else {
                                        if (dealCard.rank != "A") {
                                            endtrue = true
                                            responsenow = "s"
                                        } else {
                                            addco = "Soft "
                                        }
                                    }
                                }

                                if (endtrue == false) {
                                    if (value >= 21) {
                                        responsenow = "s"
                                    } else {
                                        responsenow = "h"
                                    }
                                }

                                if (responsenow != "s") {
                                    if (options.normalEmbed == true) {
                                        normalembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                                    } else {
                                        normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.content, `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`).replace(`{yvalue}`, `${addco}${value}`)
                                        copiedEmbed.content = `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`
                                        copiedEmbed.value = `${addco}${value}`
                                    }
                                    ori = message.channel.send({ content: normalcontent, embeds: [normalembed] })
                                    normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                                }
                                startAt++
                            } else if (["e", "en", "end"].includes(theanswer)) {
                                responsenow = "cancel"
                            } else if (["s", "st", "sta", "stan", "stand"].includes(theanswer)) {
                                responsenow = "s"
                            } else if (["dd", "double-down", "double down", "d"].includes(theanswer)) {
                                responsenow = "dd"
                            } else if (["sp", "spl", "spli", "split"].includes(theanswer)) {
                                responsenow = "split"
                            }
                        }
                    }
                )
            }

            while (responsenow == "dd") {
                doubledtrue = true
                let dealCard = NEWDECKS[startAt - 1]
                yourdeck.push(dealCard)
                if (dealCard.rank == "A") {
                    if (yourrank.includes("A")) {
                        dealCard.value = 1
                    } else {
                        dealCard.value = 11
                    }
                }
                yourcontent.push(`${dealCard.emoji} ${dealCard.rank}`)
                yourrank.push(dealCard.rank)
                youremoji.push(dealCard.emoji)
                value = value + dealCard.value
                responsenow = "s"
            }

            while (responsenow == "split") {
                let deletedi = yourdeck.pop()
                value = value - deletedi.value
                yourrank.pop()
                youremoji.pop()
                yourcontent.pop()
                if (options.normalEmbed == true) {
                    normalembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                } else {
                    normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.content, `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`).replace(`{yvalue}`, `${addco}${value}`)
                    copiedEmbed.content = `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`
                    copiedEmbed.value = `${addco}${value}`
                }
                ori = message.channel.send({ content: normalcontent, embeds: [normalembed] })
                normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                responsenow = "h"
            }

            while (responsenow == "h") {

                await message.channel.awaitMessages({ filter: filter1, max: 1, time: 30000 }).then(async allresponses => {
                    if (!allresponses.size) {
                        responsenow = "timeout"
                    } else {
                        let theanswer = String(allresponses.first()).toLowerCase()
                        if (["h", "hi", "hit"].includes(theanswer)) {
                            let dealCard = NEWDECKS[startAt - 1]
                            yourdeck.push(dealCard)
                            if (dealCard.rank == "A") {
                                if (yourrank.includes("A")) {
                                    dealCard.value = 1
                                } else {
                                    dealCard.value = 11
                                    addco = "Soft "
                                }
                            }
                            value = value + dealCard.value
                            yourcontent.push(`${dealCard.emoji} ${dealCard.rank}`)
                            yourrank.push(dealCard.rank)
                            youremoji.push(dealCard.emoji)
                            let endtrue = false
                            if (value >= 21) {
                                if (addco == "Soft ") {
                                    addco = ""
                                    for (let usu = 0; usu < yourdeck.length; usu++) {
                                        if (yourdeck[usu].rank == "A") {
                                            yourdeck[usu].value = 1
                                            value = value - 10
                                        }
                                    }

                                } else {
                                    if (dealCard.rank != "A") {
                                        endtrue = true
                                        responsenow = "s"
                                    } else {
                                        addco = "Soft "
                                    }
                                }
                            }
                            if (endtrue == false) {
                                if (value >= 21) {
                                    responsenow = "s"
                                } else {
                                    responsenow = "h"
                                }
                            }

                            if (responsenow != "s") {
                                if (options.normalEmbed == true) {
                                    normalembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                                } else {
                                    normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.content, `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`).replace(`{yvalue}`, `${addco}${value}`)
                                    copiedEmbed.content = `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`
                                    copiedEmbed.value = `${addco}${value}`
                                }
                                ori = message.channel.send({ content: normalcontent, embeds: [normalembed] })
                                normalembed.fields[0].value = normalembed.fields[0].value.replace(copiedEmbed.value, `{yvalue}`)
                            }
                            startAt++
                        } else if (["e", "end", "en"].includes(theanswer)) {
                            responsenow = "cancel"
                        } else {
                            responsenow = "s"
                        }
                    }
                })

            }

            while (responsenow == "s") {
                games.delete(message.member.id)
                while (dvalue < 17) {
                    let newcard = dealerdeck.push(NEWDECKS[startAt - 1])
                    dealercontent.push(`${NEWDECKS[startAt - 1].emoji} ${NEWDECKS[startAt - 1].rank}`)
                    dealerrank.push(NEWDECKS[startAt - 1].rank)
                    dealeremoji.push(NEWDECKS[startAt - 1].emoji)
                    if (newcard.rank == "A") {
                        if (dealerrank.includes("A")) {
                            NEWDECKS[startAt - 1].value = 1
                        } else {
                            NEWDECKS[startAt - 1].value = 11
                        }
                    }
                    dvalue = dvalue + NEWDECKS[startAt - 1].value
                    if (dvalue > 21 && dealerrank.includes("A")) {
                        let unu = 0
                        dealerdeck.forEach(e => {
                            if (e.rank == "A") {
                                dealerdeck[unu].value = 1
                            }
                            unu++
                        })
                    }
                    startAt++
                }
                responsenow = "INVALID"

                if (value > 21 || (dvalue <= 21 && value < dvalue)) {
                    if (value > 21) {
                        method = "Busted"
                    } else if (dvalue == 21) {
                        method = "Dealer reached 21"
                    } else {
                        method = "Dealer had more"
                    }
                    loseembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                    loseembed.fields[1].value = `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``
                    if (options.resultEmbed == true) {
                        message.channel.send({ embeds: [loseembed] })
                    }
                    RESULTS = "Lose"
                    if (doubledtrue == true) {
                        RESULTS = "Double Lose"
                    }
                } else if (value == 21 || value > dvalue || dvalue > 21) {
                    if (value == 21) {
                        method = "Blackjack"
                    } else if (dvalue > 21) {
                        method = "Dealer Bust"
                    } else {
                        method = "Player had more"
                    }
                    winembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                    winembed.fields[1].value = `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``
                    if (options.resultEmbed == true) {
                        message.channel.send({ embeds: [winembed] })
                    }
                    RESULTS = "Win"
                    if (doubledtrue == true) {
                        RESULTS = "Double Win"
                    }
                } else if (value == dvalue) {
                    method = "Tie"
                    tieembed.fields[0].value = `Cards: [\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${addco}${value}\``
                    tieembed.fields[1].value = `Cards: [\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)\nTotal: \`${dvalue}\``
                    if (options.resultEmbed == true) {
                        message.channel.send({ embeds: [tieembed] })
                    }
                    RESULTS = "Tie"
                } else {
                    let errEmbed = new Discord.MessageEmbed()
                        .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic:true})})
                        .setTitle("ERROR ‼️")
                        .setDescription("Uh oh! An error occured! Please join our server by clicking [here](https://discord.gg/HQ)")
                        .setFooter({text: "Oops"})
                        .setColor("#FF0000")
                    if (options.resultEmbed == true) {
                        message.channel.send({ embeds: [errEmbed] })
                    }
                    RESULTS = "ERROR"
                }
                responsenow = "ENDED"
            }


            while (responsenow == "cancel") {
                games.delete(message.member.id)
                if (options.resultEmbed == true) {
                    message.channel.send({ embeds: [cancelembed] })
                }
                responsenow = "INVALID"
                RESULTS = "Cancel"
            }

            while (responsenow == "timeout") {
                games.delete(message.member.id)
                if (options.resultEmbed == true) {
                    message.channel.send({ embeds: [noResEmbed] })
                }
                RESULTS = "Timeout"
                responsenow = "INVALID"
            }
        }

        let FINALRESULTS = {
            result: RESULTS,
            method: method,
            yvalue: `${addco}${value}`,
            dvalue: dvalue,
            ycontent: `[\`${yourcontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`,
            dcontent: `[\`${dealercontent.join("`](https://patrolbot.xyz)   [`")}\`](https://patrolbot.xyz)`,
            yrank: yourrank,
            yemoji: youremoji,
            drank: dealerrank,
            demoji: dealeremoji
        }

        return FINALRESULTS
    } catch (e) {
        console.log(`[DISCORD_BLACKJACK]: ${e.message}`)
    }
}
*/
