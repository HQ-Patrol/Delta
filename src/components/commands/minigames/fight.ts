import { MessageEmbed, GuildMember } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import ms from "ms";
import humanizeDuration from "humanize-duration";
import { User as Users } from "../../../database/models/UserModel";
import { RoleModel as Roles } from "../../../database/models/RoleModel";
import { readFileSync, writeFileSync } from "fs";
import config from "../../../config";
import userWeekly from "../../../database/models/UserWeeklyMissionsModel";
import userMonthly from "../../../database/models/UserMonthlyMissionsModel";
import { FightModel as Fun } from "../../../database/models/FightModel";
const simped = new Map();

@ApplyOptions<Command.Options>({
  name: "fight",
  description:
    "Fight any person to death and loser shall get MUTED for a random amount of time!",
})
export class FightCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
          subcommand
            .setName("user")
            .setDescription("Fight with a user")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to fight against.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("status")
            .setDescription("Set the new status")
            .addStringOption((option) =>
              option
                .setName("status")
                .setDescription("What's your new status?")
                .addChoices(
                  { name: "On", value: "on" },
                  { name: "Off", value: "off" },
                  { name: "Win", value: "win" },
                  { name: "Lose", value: "lose" }
                )
                .setRequired(true)
            )
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const Allow = await Roles.findOne({ id: interaction.guild?.id });
    if (Allow) {
      if (Allow.fight.length >= 1) {
        // @ts-ignore
        if (!interaction.member?.roles.cache.has(Allow.fight[0].role)) {
          return interaction.reply({
            embeds: [
              {
                color: "RED",
                description: `You don't seem to have the required Role/Rank <@&${Allow.fight[0].role}> to use \`fight\` command <a:exclamation:741988026296696872>`,
              },
            ],
          });
        }
      }
    }

    const fun = await Fun.findOne({ id: interaction.user.id });
    if (!fun) {
      await Fun.create({
        id: interaction.user.id,
        fight: {
          total: 0,
          success: 0,
          fails: 0,
          wl: 1,
        },
        allow: true,
      });
      return interaction.reply(
        `\`${interaction.user.username} 𝘴𝘵𝘢𝘳𝘵𝘦𝘥 𝘵𝘩𝘦𝘪𝘳 𝘫𝘰𝘶𝘳𝘯𝘦𝘺 𝘢𝘴 𝘢 𝘣𝘳𝘢𝘷𝘦 𝘸𝘢𝘳𝘳𝘪𝘰𝘳. 𝘞𝘪𝘭𝘭 𝘵𝘩𝘦𝘪𝘳 𝘯𝘢𝘮𝘦 𝘣𝘦 𝘦𝘯𝘨𝘳𝘢𝘷𝘦𝘥 𝘪𝘯 𝘩𝘪𝘴𝘵𝘰𝘳𝘺 𝘢𝘴 𝘢 𝘧𝘦𝘢𝘳𝘭𝘦𝘴𝘴 𝘱𝘰𝘸𝘦𝘳𝘩𝘰𝘶𝘴𝘦? 𝘖𝘯𝘭𝘺 𝘵𝘪𝘮𝘦 𝘸𝘪𝘭𝘭 𝘵𝘦𝘭𝘭\`🤞  `
      );
    }

    let user = await Users.findOne({ id: interaction.user.id });
    if (!user) {
      user = await Users.create({
        id: interaction.user.id,
        premium: false,
        blacklisted: false,
      });
    }

    let subcommand = interaction.options.getSubcommand();

    if (subcommand === "status") {
      let newStatus = interaction.options.getString("status") as string;

      if (newStatus.toLowerCase() === "off") {
        if (user.premium === false) {
          return interaction.reply({
            embeds: [
              {
                color: "RED",
                description:
                  "You need to be a __**PREMIUM Patrol bot user**__ to use this feature <a:exclamation:741988026296696872> ",
              },
            ],
          });
        }
        if (!fun.allow || fun.allow === true) {
          fun.allow = false;
          await fun.save();
          return interaction.reply({
            embeds: [
              {
                color: "GREEN",
                description:
                  "You just used your PREMIUM MEMBER STATUS *(and a tinge of cowardice)* to turn down all your future fight requests! <a:HamsterJigga:731172699639906397> ",
              },
            ],
          });
        }
        if (fun.allow === false)
          return interaction.reply({
            embeds: [
              {
                color: "YELLOW",
                description:
                  "You already were indomitable, Stop being paranoid and maybe turn this **ON** <a:HamsterJigga:731172699639906397> ",
              },
            ],
          });
      }

      if (newStatus.toLowerCase() === "on") {
        if (user.premium === false) {
          return interaction.reply({
            embeds: [
              {
                color: "RED",
                description:
                  "You need to be a __**PREMIUM Patrol bot user**__ to use this feature <a:exclamation:741988026296696872> ",
              },
            ],
          });
        }
        if (!fun.allow) {
          fun.allow = true;
          await fun.save();
          return interaction.reply({
            embeds: [
              {
                color: "GREEN",
                description:
                  "You just used your PREMIUM MEMBER STATUS *(and your big d!ck energy)* to got back in the battlefield. You can now be fought! <a:LetsFight:771073637376852030> ",
              },
            ],
          });
        }
        if (fun.allow === true)
          return interaction.reply({
            embeds: [
              {
                color: "YELLOW",
                description:
                  "You already were in the battlefield! Stop being paranoid and if you want, turn this **OFF** <a:HamsterJigga:731172699639906397> ",
              },
            ],
          });
      }

      if (newStatus.toLowerCase() === "win") {
        // @ts-ignore
        if (!config.sdog.some((x) => interaction.member.roles.cache.has(x))) {
          return interaction.reply({
            embeds: [
              {
                color: "RED",
                description:
                  "You need to be a __**SUGAR DADDY OF THE GANG**__ to use this feature <a:exclamation:741988026296696872>",
              },
            ],
          });
        }
        let current = JSON.parse(
          await readFileSync("./json/special.json", "utf8")
        );
        let index = current.AlwaysWin.indexOf(interaction.user.id);
        if (index > -1) {
          interaction.reply("You're already winning son ✅");
          return interaction.reply("<:AreYaWinningSon:867089730780397578>");
        } else {
          current.AlwaysWin.push(interaction.user.id);
        }
        writeFileSync("./json/special.json", JSON.stringify(current));
        return interaction.reply("Enjoy playing on Recruit mode ✅");
      }

      if (newStatus.toLowerCase() === "lose") {
        // @ts-ignore
        if (!config.sdog.some((x) => interaction.member.roles.cache.has(x))) {
          return interaction.reply({
            embeds: [
              {
                color: "RED",
                description:
                  "You need to be a __**SUGAR DADDY OF THE GANG**__ to use this feature <a:exclamation:741988026296696872>",
              },
            ],
          });
        }
        let current = JSON.parse(
          await readFileSync("./json/special.json", "utf8")
        );
        let index = current.AlwaysWin.indexOf(interaction.user.id);
        if (index > -1) {
          current.AlwaysWin.splice(index, 1);
        } else {
          interaction.reply("You were never winning son ☹");
          return interaction.reply("<:AreYaWinningSon:867089730780397578>");
        }
        writeFileSync("./json/special.json", JSON.stringify(current));
        return interaction.reply(
          "You are extra-ordinarily humble for doing this King 👑"
        );
      }
    }

    const cooldown = simped.get(interaction.user.id);

    let person = interaction.options.getMember("user") as GuildMember;

    if (!person) {
      if (!cooldown) {
        return interaction.reply("Couldn't find that member!");
      } else {
        let remaining = humanizeDuration(cooldown - Date.now(), {
          units: ["h", "m", "s"],
          round: true,
        });
        return interaction.reply(
          `${interaction.user}, Wait \`${remaining}\` before fighting someone else, Gladiator headass <a:LmaoBlast:741346535358595072><a:RedTick:736282199258824774>`
        );
      }
    }

    let tofightplayer = await Fun.findOne({ id: person.id });
    if (!tofightplayer) {
      await Fun.create({
        id: person.id,
        fight: {
          total: 0,
          success: 0,
          fails: 0,
          wl: 1,
        },
        allow: true,
      });
      //return interaction.reply(`${person} \`𝘨𝘰𝘵 𝘥𝘳𝘢𝘨𝘨𝘦𝘥 𝘪𝘯𝘵𝘰 𝘵𝘩𝘦 𝘊𝘰𝘭𝘰𝘴𝘴𝘦𝘶𝘮. 𝘛𝘩𝘦𝘺 𝘤𝘢𝘯 𝘯𝘰𝘸 𝘣𝘦 𝘧𝘰𝘶𝘨𝘩𝘵!\`🤞  `)
      interaction.reply(`${person} \`𝘨𝘰𝘵 𝘥𝘳𝘢𝘨𝘨𝘦𝘥 𝘪𝘯𝘵𝘰 𝘵𝘩𝘦 𝘊𝘰𝘭𝘰𝘴𝘴𝘦𝘶𝘮.\`🤞  `);
      const embed = new MessageEmbed()
        .setTitle(`${interaction.user.username} started a DUEL! ⚔`)
        .setThumbnail("https://i.imgur.com/JZ3teuL.gif")
        .setDescription(
          `${interaction.user} *__**WON**__ the duel against ${person.user} and TIMED-OUT them for 12s 🤐`
        )
        .setFooter({ text: `Stop ragging newbies 😭` });

      person.timeout(12000).catch((err: any) =>
        interaction.reply({
          embeds: [{ color: "RED", description: `Error: ${err}` }],
        })
      );
      return interaction.reply({ embeds: [embed] });
    }

    if (tofightplayer.allow === false) {
      return interaction.reply({
        embeds: [
          {
            color: "RED",
            description: `${person} has decided to turn all fight requests down. Let them vibe in peace 😷`,
          },
        ],
      });
    }

    if (person.id === "839658116362272808") {
      const emb = new MessageEmbed()
        .setImage("https://i.imgur.com/ddSazKk.gif")
        .setTitle(
          "He's TOO Powerful!! <:EricaGunShot:898205365215322132> You ended up getting TIMED-OUT."
        );
      interaction.reply({ embeds: [emb] });
      (interaction.member as GuildMember).timeout(60000).catch((err: any) =>
        interaction.reply({
          embeds: [{ color: "RED", description: `Error: ${err}` }],
        })
      );
    }

    if (person.id === interaction.user.id) {
      (interaction.member as GuildMember).timeout(25000).catch((err: any) =>
        interaction.reply({
          embeds: [{ color: "RED", description: `Error: ${err}` }],
        })
      );
      interaction.reply(
        "```You ended up fighting yourself 🤦‍♂️ 25s MUTE for your clownery 🤷‍♀️ Typical.```"
      );
    }

    //if (config.owner.includes(interaction.user.id)) { value=1000000 }
    let current = JSON.parse(await readFileSync("./json/special.json", "utf8"));
    let index = current.AlwaysWin.indexOf(interaction.user.id);
    if (interaction.user.id === "839658116362272808" || index > -1) {
      const embed = new MessageEmbed()
        .setTitle(`${interaction.user.username} started a DUEL! ⚔`)
        .setThumbnail("https://i.imgur.com/PIuT69P.gif")
        .setDescription(
          `${interaction.user} *__**WON**__ the duel against ${person.user} and MUTED them for 20s 🤐 Looks like odds are always in his favor <:WAH:740257222344310805>`
        )
        .setFooter({
          text: `⚔ Total Duels: ${fun.fight.total} || ☠ W/L: ${(
            fun.fight.wl * 100
          ).toFixed(1)}`,
        });

      person.timeout(20000).catch((err: any) =>
        interaction.reply({
          embeds: [{ color: "RED", description: `Error: ${err}` }],
        })
      );
      return interaction.reply({ embeds: [embed] });
    }

    if (cooldown) {
      const remaining = humanizeDuration(cooldown - Date.now(), {
        units: ["h", "m", "s"],
        round: true,
      });
      return interaction
        .reply(
          `${interaction.user}, Wait \`${remaining}\` before fighting someone else, Gladiator headass <a:LmaoBlast:741346535358595072><a:RedTick:736282199258824774>`
        )
        .catch(console.error);
    } else {
      let random = [
        "https://i.imgur.com/hPOWop2.gif",
        "https://i.imgur.com/qwrlMk9.gif",
        "https://i.imgur.com/eKhX7ln.gif",
        "https://i.imgur.com/2mwZ0cB.gif",
        "https://i.imgur.com/ccIEe0r.gif",
        "https://i.imgur.com/xWpVXxB.gif",
        "https://i.imgur.com/lQypKMZ.gif",
        "https://i.imgur.com/PjwEejr.gif",
      ];
      let gif = random[Math.floor(Math.random() * random.length)];

      let time = Math.floor(Math.random() * 100000) + 15000;
      let Probab = Math.random() < 0.5 ? "l" : "w";

      const embed = new MessageEmbed()
        .setTitle(`${interaction.user.username} started a DUEL! ⚔`)
        .setThumbnail(gif);
      embed.setFooter({
        text: `⚔ Total Duels: ${fun.fight.total} || ☠ W/L: ${(
          fun.fight.wl * 100
        ).toFixed(1)}%`,
      });

      if (Probab == "l") {
        embed.setColor("#FF0000");
        embed.setDescription(
          `${interaction.user} *__**LOST**__ the duel against ${
            person.user
          } and ended up getting themselves muted for ${ms(time)}*`
        );
        interaction.reply({ embeds: [embed] });
        (interaction.member as GuildMember).timeout(time).catch(() =>
          interaction.reply({
            embeds: [
              {
                color: "RED",
                description: `Error: Patrol Bot doesn't seem to have Permission to Mute this person!`,
              },
            ],
          })
        );

        fun.fight.total = fun.fight.total + 1;
        fun.fight.fails = fun.fight.fails + 1;
        fun.fight.wl = fun.fight.success / fun.fight.fails;
        (await fun).save();

        //Weekly/Monthly Mission Section================
        //  let weeklyDataL = await userWeekly.findOne({ id: interaction.user.id });
        // if(!weeklyDataL) {
        // 	await userWeekly.create({
        // 		id: interaction.user.id,
        // 		fight: { users:[`${person.id}`],wins:0,loss:1,prize:false,prizePlus:false }
        // 		})
        // }
        // else {
        //     let FindPerson1 = weeklyDataL.fight.users.indexOf(`${person.id}`)
        //     if(FindPerson1==-1) { /*Success*/
        //     if(weeklyDataL.fight.loss>0) { weeklyDataL.fight.loss+=1; } else { weeklyDataL.fight.loss=1;}
        //     weeklyDataL.fight.users.push(person.id); await weeklyDataL.save().catch(err => console.log(err)); }
        //     else { /*FAIL*/  }
        //     }

        let monthlyDataL = await userMonthly.findOne({
          id: interaction.user.id,
        });
        if (!monthlyDataL) {
          await userMonthly.create({
            id: interaction.user.id,
            fight: {
              users: [`${person.id}`],
              wins: 0,
              loss: 1,
              prize: false,
              prizePlus: false,
            },
          });
        } else {
          let FindPerson1 = monthlyDataL.fight.users.indexOf(`${person.id}`);
          if (FindPerson1 == -1) {
            /*Success*/
            if (monthlyDataL.fight.loss > 0) {
              monthlyDataL.fight.loss += 1;
            } else {
              monthlyDataL.fight.loss = 1;
            }
            monthlyDataL.fight.users.push(person.id);
            await monthlyDataL.save().catch((err: any) => console.log(err));
          } else {
            /*FAIL*/
          }
        }
        //Weekly/Monthly END=================================================================
      } else {
        embed.setColor("#00FF00");
        embed.setDescription(
          `${interaction.user} *__**WON**__ the duel against ${
            person.user
          } and MUTED them for ${ms(time)}*`
        );
        interaction.reply({ embeds: [embed] });
        person.timeout(time).catch((err: any) =>
          interaction.reply({
            embeds: [{ color: "RED", description: `Error: ${err}` }],
          })
        );

        fun.fight.total = fun.fight.total + 1;
        fun.fight.success = fun.fight.success + 1;
        fun.fight.wl = fun.fight.success / fun.fight.fails;
        (await fun).save();

        //Weekly/Monthly Mission Section================
        let weeklyDataW = await userWeekly.findOne({ id: interaction.user.id });
        if (!weeklyDataW) {
          await userWeekly.create({
            id: interaction.user.id,
            fight: {
              users: [`${person.id}`],
              wins: 1,
              loss: 0,
              prize: false,
              prizePlus: false,
            },
          });
        } else {
          let FindPerson1 = weeklyDataW.fight.users.indexOf(`${person.id}`);
          if (FindPerson1 == -1) {
            /*Success*/
            if (weeklyDataW.fight.wins > 0) {
              weeklyDataW.fight.wins += 1;
            } else {
              weeklyDataW.fight.wins = 1;
            }
            weeklyDataW.fight.users.push(person.id);
            await weeklyDataW.save().catch((err: any) => console.log(err));
          } else {
            /*FAIL*/
          }
        }

        let monthlyDataW = await userMonthly.findOne({
          id: interaction.user.id,
        });
        if (!monthlyDataW) {
          await userMonthly.create({
            id: interaction.user.id,
            fight: {
              users: [`${person.id}`],
              wins: 1,
              loss: 0,
              prize: false,
              prizePlus: false,
            },
          });
        } else {
          let FindPerson1 = monthlyDataW.fight.users.indexOf(`${person.id}`);
          if (FindPerson1 == -1) {
            /*Success*/
            if (monthlyDataW.fight.wins > 0) {
              monthlyDataW.fight.wins += 1;
            } else {
              monthlyDataW.fight.wins = 1;
            }
            monthlyDataW.fight.users.push(person.id);
            await monthlyDataW.save().catch((err: any) => console.log(err));
          } else {
            /*FAIL*/
          }
        }
        //Weekly/Monthly END=================================================================
      }
      simped.set(interaction.user.id, Date.now() + 600000);
      setTimeout(() => simped.delete(interaction.user.id), 600000);
    }
  }
}
