import { MessageEmbed, User } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import findUserById from "../../../database/functions/economy/findUserById";
import { BadgesModel as BADGES } from "../../../database/models/BadgesModel";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import Badges from "../../../data/json/badges.json";
import userWeekly from "../../../database/models/UserWeeklyMissionsModel";
import userMonthly from "../../../database/models/UserMonthlyMissionsModel";
import { GamblingCardModel } from "../../../database/models/GamblingCardModel";

@ApplyOptions<Command.Options>({
  name: "coinflip",
  description: "Flip a coin and gamble your money away!",
})
export class CoinFlipCommand extends Command {
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
            .addStringOption((option) =>
              option
                .setName("choice")
                .setDescription("What's your choice? Heads or Tails?")
                .addChoices(
                  { name: "Heads", value: "heads" },
                  { name: "Tails", value: "tails" }
                )
                .setRequired(true)
            )
            .addUserOption((option) =>
              option.setName("user").setDescription("The user to bet against.")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("bet")
            .setDescription("Bet with some of your coins.")
            .addStringOption((option) =>
              option
                .setName("choice")
                .setDescription("What's your choice? Heads or Tails?")
                .addChoices(
                  { name: "Heads", value: "heads" },
                  { name: "Tails", value: "tails" }
                )
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("bet")
                .setDescription("Your bet amount.")
                .setMinValue(50)
                .setRequired(true)
            )
            .addUserOption((option) =>
              option.setName("user").setDescription("The user to bet against.")
            )
        )
    );
  }

  public async chatInputRun(
    interaction: Command.ChatInputInteraction & {
      cardResult: boolean | undefined;
    }
  ) {
    let callOut =
      interaction.options.getString("choice") === "heads" ? "HEADS" : "TAILS";
    let subcommand = interaction.options.getSubcommand();
    let all = (await findUserById(interaction.user.id)).coins;
    let amount = (
      subcommand === "all" ? all : interaction.options.getInteger("bet")
    ) as number;
    let person = interaction.options.getUser("user");

    if (amount < 50)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setDescription(
              "You must bet 50 or more coins in a coinflip <a:exclamation:741988026296696872>"
            ),
        ],
      });

    if (all < amount)
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

    if (person) {
      if (person.id == interaction.user.id)
        return interaction.reply(
          "You can't just challenge yourself. **Challenge yourself by closing Discord and getting your __FAT ASS__ off the couch for once and being productive**. Jfc just look at yourself in the mirror for once 😭"
        );

      if ((await findUserById(person.id)).coins < amount)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#FF0000")
              .setTitle(`${person.username}'s Insufficient Wallet Balance`)
              .setDescription(
                "<a:RedTick:736282199258824774> They cannot flip more coins than their wallet"
              ),
          ],
        });

      const msg = await interaction.reply({
        content: person.toString(),
        embeds: [
          new MessageEmbed()
            .setColor("#0000FF")
            .setAuthor({
              name: "Coinflip Challenge!",
              iconURL: person.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail("https://i.imgur.com/ckGjmjX.gif")
            .setDescription(
              `\`${person.username} initiated a game of CoinFlip against ${person.username}~\`\n${person} took out **${amount} Coins** and called out **${callOut}**!`
            )
            .setFooter({
              text: "You got 60 seconds to react with '✅' or '❌' to either ACCEPT or DECLINE the challenge!",
            }),
        ],
      });

      // @ts-ignore
      await msg.react("✅");
      // @ts-ignore
      await msg.react("❌");

      let xyz = false;

      const filter = (r: any, u: any) =>
        ["✅", "❌"].includes(r.emoji.name) && u.id == (person as User).id;
      // @ts-ignore
      const collector = msg.createReactionCollector({
        filter,
        time: 60000,
        max: 1,
      });

      collector.on("collect", async (r: any) => {
        if (r.emoji.name == "✅") {
          // @ts-ignore
          msg.delete();
          xyz = true;
          const chance = Math.random() < 0.5;
          if (chance) {
            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#00FF00")
                  .setTitle(`It's ${callOut}!`)
                  .setDescription(
                    `👍 | ${
                      interaction.user
                    } __**WON**__ the coinflip against ${person} and earned **${
                      2 * Number(amount)
                    } Coins** <a:Coins:775714101564276756>`
                  ),
              ],
            }); //Ez Dubs gg well played!

            await Eco.updateOne(
              { id: interaction.user.id },
              { $inc: { coins: amount } }
            );
            await Eco.updateOne(
              { id: (person as User).id },
              { $inc: { coins: -amount } }
            );

            interaction.cardResult = true; // Message Author Won
          } else {
            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#f99440")
                  .setTitle(`It's NOT ${callOut}!`)
                  .setDescription(
                    `👎 | ${
                      interaction.user
                    } __**LOST**__ the coinflip against ${person} and helped them make quick **${
                      2 * Number(amount)
                    } Coins** <a:Coins:775714101564276756>`
                  ),
              ],
            });

            await Eco.updateOne(
              { id: (person as User).id },
              { $inc: { coins: amount } }
            );
            await Eco.updateOne(
              { id: interaction.user.id },
              { $inc: { coins: -amount } }
            );

            interaction.cardResult = false; // Message Author LOST
          }

          //Monthly Mission Section================
          const monthlyData = await userMonthly.findOne({
            id: interaction.user.id,
          });
          if (!monthlyData) {
            await userMonthly.create({
              id: interaction.user.id,
              cfBattle: {
                value: 1,
                users: [`${(person as User).id}`],
                wins: 0,
                loss: 0,
                prize: false,
                prizePlus: false,
              },
            });
          } else {
            const FindPerson1 = monthlyData.cfBattle.users.indexOf(
              `${(person as User).id}`
            );
            if (FindPerson1 == -1) {
              /*Success*/
              if (monthlyData.cfBattle.value > 0) {
                monthlyData.cfBattle.value += 1;
              } else {
                monthlyData.cfBattle.value = 1;
              }
              if (monthlyData.cfBattle.wins > 0) {
                monthlyData.cfBattle.wins += 1;
              } else {
                monthlyData.cfBattle.wins = 1;
              }
              if (monthlyData.cfBattle.loss > 0) {
                monthlyData.cfBattle.loss += 0;
              } else {
                monthlyData.cfBattle.loss = 0;
              }
              monthlyData.cfBattle.users.push((person as User).id);
              await monthlyData.save().catch((err: any) => console.log(err));
            } else {
              /*FAIL*/ if (chance) {
                monthlyData.cfBattle.wins += 1;
              } else {
                monthlyData.cfBattle.loss += 1;
              }
              monthlyData.cfBattle.value += 1;
              await monthlyData.save().catch((err: any) => console.log(err));
            }
          }
          //Monthly END=================================================================
        } else {
          // @ts-ignore

          msg.delete();
          xyz = true;
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(
                  `👎 | ${person} __**DECLINED**__ your Coinflip challenge <:WAH:740257222344310805>`
                ),
            ],
          });
        }

        collector.stop();
      });

      collector.on("end", async () => {
        setTimeout(async () => {
          if (xyz) return;
          // @ts-ignore

          msg.delete();
          await interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("#FF0000")
                .setTitle("CANCELLED ❌")
                .setDescription(`👎 | **${person} did not answer in time!** `),
            ],
          });
        }, 200);
      });
    } else {
      const chance = Math.random() < 0.5;
      if (chance) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#00FF00")
              .setTitle(`It's ${callOut}!`)
              .setDescription(
                `👍 | You __**WON**__ the coinflip and earned **${
                  2 * Number(amount)
                } Coins** <a:Coins:775714101564276756>`
              ),
          ],
        });

        await Eco.updateOne(
          { id: interaction.user.id },
          { $inc: { coins: Number(amount) } }
        );

        //Monthly Mission Section================
        if (Number(amount) > 9999) {
          const monthlyDataW = await userMonthly.findOne({
            id: interaction.user.id,
          });
          if (!monthlyDataW) {
            await userMonthly.create({
              id: interaction.user.id,
              cf: {
                value: 1,
                wins: 1,
                loss: 0,
                prize: false,
                prizePlus: false,
              },
            });
          } else {
            if (monthlyDataW.cf.value > 0) {
              monthlyDataW.cf.value += 1;
            } else {
              monthlyDataW.cf.value = 1;
            }
            if (monthlyDataW.cf.wins > 0) {
              monthlyDataW.cf.wins += 1;
            } else {
              monthlyDataW.cf.wins = 1;
            }
            monthlyDataW.save().catch((err: any) => console.log(err));
          }
        }
        //Monthly END=================================================================
        interaction.cardResult = true; // Message Author Won
      } else {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#FF0000")
              .setTitle(`It's NOT ${callOut}!`)
              .setDescription(
                `👎 | You __**LOST**__ the coinflip and with it your **${Number(
                  amount
                )} Coins** <a:Coins:775714101564276756>`
              ),
          ],
        });

        await Eco.updateOne(
          { id: interaction.user.id },
          { $inc: { coins: -Number(amount) } }
        );

        //Monthly Mission Section================
        if (Number(amount) == 66666) {
          const weeklyDataL = await userWeekly.findOne({
            id: interaction.user.id,
          });
          if (!weeklyDataL) {
            await userWeekly.create({
              id: interaction.user.id,
              cf: {
                value: 1,
                wins: 0,
                loss: 1,
                prize: false,
                prizePlus: false,
              },
            });
          } else {
            if (weeklyDataL.cf.value > 0) {
              weeklyDataL.cf.value += 1;
            } else {
              weeklyDataL.cf.value = 1;
            }
            if (weeklyDataL.cf.loss > 0) {
              weeklyDataL.cf.loss += 1;
            } else {
              weeklyDataL.cf.loss = 1;
            }
            weeklyDataL.save().catch((err: any) => console.log(err));
          }
        }
        //Weekly END=================================================================
        interaction.cardResult = false; // Message Author LOST
      }

      //GAMBLING CLUB STUFF===========
      const card = await GamblingCardModel.findOne({ id: interaction.user.id });
      //if(!card) return; //break;
      if (card) {
        //exists
        if (interaction.cardResult == true) {
          if (card.cf.wins > 0) {
            card.cf.wins += 1;
          } else card.cf.wins = 1;
          if (card.cf.winnings > 0) {
            card.cf.winnings += Number(amount);
          } else card.cf.winnings = Number(amount);
        }
        if (interaction.cardResult == false) {
          if (card.cf.loss > 0) {
            card.cf.loss += 1;
          } else card.cf.loss = 1;
          if (card.cf.losses > 0) {
            card.cf.losses += Number(amount);
          } else card.cf.losses = Number(amount);
        }
        if (card.cf.total > 0) {
          card.cf.total += 1;
        } else card.cf.total = 1;
        if (card.cf.bets > 0) {
          card.cf.bets += Number(amount);
        } else card.cf.bets = Number(amount);

        card.save().catch((err: any) => console.log(err));
      }
      //GCC END============================================================================

      //Badge Addition=======
      if (Number(amount) * 2 > 9999999) {
        const badge = Badges.badges.filter(
          (b: any) => b.name.toLowerCase() === "flippin' cool"
        )[0];

        const _badges = await BADGES.findOne({ id: interaction.user.id });

        if (!_badges) {
          const b = new BADGES({
            id: interaction.user.id,
            badges: [badge],
          });

          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(
                  `<a:Coins:775714101564276756> | For that bet, ${interaction.user} **is being awarded with the badge: __Flippin' Cool__** ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
                ),
            ],
          });

          await b.save();
          return;
        } else {
          const exists = await BADGES.findOne({
            id: interaction.user.id,
            badges: { $in: [badge] },
          });

          if (exists) return;

          await BADGES.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $addToSet: { badges: [badge] },
            }
          );

          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(
                  `<a:Coins:775714101564276756> | For that bet, ${interaction.user} **is being awarded with the badge: __Flippin' Cool__** ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
                ),
            ],
          });
        }
      }
      //=====================================================
    }
  }
}
