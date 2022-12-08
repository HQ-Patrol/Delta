import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
  InteractionCollector,
} from "discord.js";
import pretty from "pretty-ms";
import { User } from "../../../database/models/UserModel";
import { RepModel } from "../../../database/models/RepModel";
import { SOTWModel } from "../../../database/models/SOTWModel";
import { MOTWModel } from "../../../database/models/MOTWModel";
import { GuildMember } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "voterid",
  description:
    "Wanna start voting for your Favorite Mods, Simps or just a reputation to your good buddy?",
})
export class VoterIDCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to view ID of.")
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;

    let userData = await User.findOne({ id: user.id });
    if (!userData)
      userData = await User.create({
        id: user.id,
        premium: false,
        blacklisted: false,
      });

    //if(!userData.Biggercooldown){
    if (!userData.Biggercooldown.find((x: any) => x.command === "modvote")) {
      const Cooldownmv = userData.Biggercooldown.find(
        (x: any) => x.command === "modvote"
      );
      if (!Cooldownmv) {
        userData.Biggercooldown.push({
          command: "modvote",
          endCooldown: Date.now(),
        });

        const CooldownDemv = userData.Biggercooldown.find(
          (x: any) => x.command === "demodvote"
        );
        if (!CooldownDemv) {
          userData.Biggercooldown.push({
            command: "demodvote",
            endCooldown: Date.now(),
          });
        }

        const Cooldownrep = userData.Biggercooldown.find(
          (x: any) => x.command === "rep"
        );
        if (!Cooldownrep) {
          userData.Biggercooldown.push({
            command: "rep",
            endCooldown: Date.now(),
          });
        }

        const CooldownDerep = userData.Biggercooldown.find(
          (x: any) => x.command === "derep"
        );
        if (!CooldownDerep) {
          userData.Biggercooldown.push({
            command: "derep",
            endCooldown: Date.now(),
          });
        }

        const Cooldownsimp = userData.Biggercooldown.find(
          (x: any) => x.command === "simp"
        );
        if (!Cooldownsimp) {
          userData.Biggercooldown.push({
            command: "simp",
            endCooldown: Date.now(),
          });
        }

        const CooldownDesimp = userData.Biggercooldown.find(
          (x: any) => x.command === "desimp"
        );
        if (!CooldownDesimp) {
          userData.Biggercooldown.push({
            command: "desimp",
            endCooldown: Date.now(),
          });
        }
        await userData.save().catch((err: any) => console.log(err));
      }
      interaction.reply(
        "You received your Voter's 🆔 and will **NOW** be allowed to put out different type of Votes! <a:GoVote:787376884731478046>😋"
      );
      return;
    }

    let Cooldownmv = userData.Biggercooldown.find(
      (x: any) => x.command === "modvote"
    ) as any;
    let CooldownDemv = userData.Biggercooldown.find(
      (x: any) => x.command === "demodvote"
    ) as any;
    let Cooldownrep = userData.Biggercooldown.find(
      (x: any) => x.command === "rep"
    ) as any;
    let CooldownDerep = userData.Biggercooldown.find(
      (x: any) => x.command === "derep"
    ) as any;
    let Cooldownsimp = userData.Biggercooldown.find(
      (x: any) => x.command === "simp"
    ) as any;
    let CooldownDesimp = userData.Biggercooldown.find(
      (x: any) => x.command === "desimp"
    ) as any;

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${user.username}'s Voter ID 📇`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("RANDOM")
      .setThumbnail("https://i.imgur.com/4IljHmP.gif")
      .setFooter({
        text: `𝘌𝘷𝘦𝘳𝘺 𝘗𝘳𝘦𝘮𝘪𝘶𝘮 𝘔𝘦𝘮𝘣𝘦𝘳 𝘩𝘢𝘴 𝘢𝘭𝘭 𝘵𝘩𝘦𝘪𝘳 𝘤𝘰𝘰𝘭𝘥𝘰𝘸𝘯𝘴 𝘳𝘦𝘥𝘶𝘤𝘦𝘥 𝘣𝘺 𝙃𝘼𝙇𝙁 ✨`,
      });

    // @ts-ignore
    const part1 =
      "➜`DeRep` <:WavyDash:760469258093723689> 24h **|** " +
      "𝗣𝗥𝗘𝗠𝗜𝗨𝗠-𝗢𝗡𝗟𝗬!🔒\n" +
      "➜`DeModVote` <:WavyDash:760469258093723689> 24h **|** " +
      "𝗣𝗥𝗘𝗠𝗜𝗨𝗠-𝗢𝗡𝗟𝗬!🔒\n" +
      "➜`DeSimp` <:WavyDash:760469258093723689> 3h **|** " +
      "𝗣𝗥𝗘𝗠𝗜𝗨𝗠-𝗢𝗡𝗟𝗬!🔒";

    const part2 =
      "➜`DeRep` <:WavyDash:760469258093723689> 24h **|** " +
      `${
        Date.now() < CooldownDerep.endCooldown
          ? `**${pretty(
              CooldownDerep.endCooldown - Date.now()
            )}**<a:Loading:727148666837663765>`
          : "`𝙍𝙀𝘼𝘿𝙔!`"
      }\n` +
      "➜`DeModVote` <:WavyDash:760469258093723689> 12h **|** " +
      `${
        Date.now() < CooldownDemv.endCooldown
          ? `**${pretty(
              CooldownDemv.endCooldown - Date.now()
            )}**<a:Loading:727148666837663765>`
          : "`𝙍𝙀𝘼𝘿𝙔!`"
      }\n` +
      "➜`DeSimp` <:WavyDash:760469258093723689> 4h **|** " +
      `${
        Date.now() < CooldownDesimp.endCooldown
          ? `**${pretty(
              CooldownDesimp.endCooldown - Date.now()
            )}**<a:Loading:727148666837663765>`
          : "`𝙍𝙀𝘼𝘿𝙔!`"
      }`;

    embed.setDescription(
      "**`COMMAND`** <:WavyDash:760469258093723689> <ᴄᴏᴏʟᴅᴏᴡɴ> **|** <ᴀᴠᴀɪʟᴀʙɪʟɪᴛʏ>\n\n" +
        "➜`Reputation` <:WavyDash:760469258093723689> 24h **|** " +
        `${
          Date.now() < Cooldownrep.endCooldown
            ? `**${pretty(
                Cooldownrep.endCooldown - Date.now()
              )}**<a:Loading:727148666837663765>`
            : "`𝙍𝙀𝘼𝘿𝙔!`"
        }\n` +
        "➜`ModVote` <:WavyDash:760469258093723689> 12h **|** " +
        `${
          Date.now() < Cooldownmv.endCooldown
            ? `**${pretty(
                Cooldownmv.endCooldown - Date.now()
              )}**<a:Loading:727148666837663765>`
            : "`𝙍𝙀𝘼𝘿𝙔!`"
        }\n` +
        "➜`SimpVote` <:WavyDash:760469258093723689> 2h **|** " +
        `${
          Date.now() < Cooldownsimp.endCooldown
            ? `**${pretty(
                Cooldownsimp.endCooldown - Date.now()
              )}**<a:Loading:727148666837663765>`
            : "`𝙍𝙀𝘼𝘿𝙔!`"
        }\n` +
        part2
    );

    const buttonsRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("rep")
        .setLabel("Rep")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("simpvotes")
        .setLabel("Simp Votes")
        .setStyle("DANGER"),
      new MessageButton()
        .setCustomId("modvotes")
        .setLabel("Mod Votes")
        .setStyle("PRIMARY")
    );

    await interaction.reply({ embeds: [embed], components: [buttonsRow] });

    const filter = (i: any) =>
      ["rep", "simpvotes", "modvotes"].includes(i.customId) &&
      i.user.id === interaction.user.id;

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 30000,
    }) as InteractionCollector<ButtonInteraction>;

    collector.on("collect", async (i: ButtonInteraction) => {
      if (i.customId === "rep") {
        await i.deferReply();

        if (userData?.premium) {
          let tagged = await RepModel.findOne({ userID: user.id });
          if (!tagged) {
            let embed2 = new MessageEmbed().setDescription(
              `They have 0 Social credits <a:crynig:748495941379817472> <a:Decrease:943232879641645056>`
            );
            i.editReply({ embeds: [embed2] });
          } else {
            let data1 = await RepModel.find({}).sort({ rep: -1 });
            let globalrep = {
              pos: data1.findIndex((d: any) => d.userID == user.id) + 1,
            };
            data1 = data1.filter((d: any) =>
              // @ts-ignore
              Array.from(interaction.guild.members.cache.keys()).includes(
                d.userID
              )
            );
            const me = {
              pos: data1.findIndex((d: any) => d.userID == user.id) + 1,
            };

            let data2 = await RepModel.find({}).sort({ repW: -1 });
            let globalrepW = {
              pos: data2.findIndex((d: any) => d.userID == user.id) + 1,
            };
            data2 = data2.filter((d: any) =>
              // @ts-ignore
              Array.from(interaction.guild.members.cache.keys()).includes(
                d.userID
              )
            );
            const me2 = {
              pos: data2.findIndex((d: any) => d.userID == user.id) + 1,
            };

            let embed2 = new MessageEmbed()
              .setAuthor({
                name: `${user.username}'s Detailed Social Credit Score 🤓`,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              })
              .setColor("RANDOM")
              .setThumbnail("https://i.imgur.com/XG12tgm.gif")
              .setFooter({ text: `👉 ID: ${user.id}` })
              .setTimestamp()
              .setDescription(
                // @ts-ignore
                ` <a:Globe:786307253598814238> 𝐓𝐨𝐭𝐚𝐥 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: 『 **${tagged.rep}** 』**||** 𝙒𝙚𝙚𝙠𝙡𝙮: \`${tagged.repW}+\`\n➜ **Server Rank**: \`#${me.pos}\` **||** Server 𝘞𝘦𝘦𝘬𝘭𝘺: \`#${me2.pos}\`\n➜ __**Global Rank**__: \`#${globalrep.pos}\` **||** Global 𝘞𝘦𝘦𝘬𝘭𝘺: \`#${globalrepW.pos}\``
              );
            let w = tagged?.repper[0] as any;
            if (w) {
              embed2.addField(
                `__Last Rep__`,
                `• ${
                  interaction.client.users.cache?.get(w.Repper)
                    ? interaction.client.users.cache?.get(w.Repper)?.tag
                    : `User Not Found: ${interaction.client.users.cache?.get(
                        w.Repper
                      )}`
                }\nTime : ${pretty(Date.now() - w.Time)} ago`,
                true
              );
            } else {
              embed2.addField(`__Last Rep__`, `-None-`, true);
            }
            let ww = tagged?.Derepper[0] as any;
            if (ww) {
              embed2.addField(
                `__Last De-Rep__`,
                `• ${
                  interaction.client.users.cache?.get(ww.DeRepper)
                    ? interaction.client.users.cache?.get(ww.DeRepper)?.tag
                    : `User Not Found: ${interaction.client.users.cache?.get(
                        ww.DeRepper
                      )}`
                }\nTime : ${pretty(Date.now() - ww.Time)} ago`,
                true
              );
            } else {
              embed2.addField(`__Last De-Rep__`, `-None-`, true);
            }

            await i.editReply({ embeds: [embed2] });
          }
        } else {
          let tagged = await RepModel.findOne({ userID: user.id });

          if (!tagged) {
            let embed2 = new MessageEmbed().setDescription(
              `They have 0 Social credits <a:crynig:748495941379817472> <a:Decrease:943232879641645056>`
            );
            await i.editReply({ embeds: [embed2] });
          } else {
            let embed2 = new MessageEmbed()
              .setAuthor({
                name: `${user.username}'s Social Credits 🥳`,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              })
              .setColor("RANDOM")
              .setThumbnail("https://i.imgur.com/Yl1SsdC.gif")
              .setFooter({
                text: `For more detailed Information about a user's Reps, become a Premium User`,
              })
              .setDescription(
                ` <a:Globe:786307253598814238> 𝐓𝐨𝐭𝐚𝐥 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: 『 **${tagged.rep}** 』**||** 𝙒𝙚𝙚𝙠𝙡𝙮: \`${tagged.repW}+\``
              );

            await i.editReply({ embeds: [embed2] });
          }
        }
      } else if (i.customId === "simpvotes") {
        await i.deferReply();

        if (userData?.premium) {
          let tagged = await SOTWModel.findOne({ userID: user.id });
          if (!tagged) {
            let embed2 = new MessageEmbed().setDescription(
              `${user} isn't a simp 😎 `
            );
            i.editReply({ embeds: [embed2] });
            return;
          } else {
            let data1 = await SOTWModel.find({}).sort({ simpV: -1 });
            let globalrep = {
              pos: data1.findIndex((d: any) => d.userID == user.id) + 1,
            };
            data1 = data1.filter((d: any) =>
              // @ts-ignore
              Array.from(interaction.guild.members.cache.keys()).includes(
                d.userID
              )
            );
            const me = {
              pos: data1.findIndex((d: any) => d.userID == user.id) + 1,
            };

            let data2 = await SOTWModel.find({}).sort({ sotw: -1 });
            let globalrepW = {
              pos: data2.findIndex((d: any) => d.userID == user.id) + 1,
            };
            data2 = data2.filter((d: any) =>
              // @ts-ignore
              Array.from(interaction.guild.members.cache.keys()).includes(
                d.userID
              )
            );
            const me2 = {
              pos: data2.findIndex((d: any) => d.userID == user.id) + 1,
            };

            let serverVote = tagged.servers.find(
              (x: any) => x.serverID === interaction.guild?.id
            );
            if (!serverVote) {
              var sv = 0;
              var svw = 0;
            } else {
              var sv: number = serverVote.SVs;
              var svw: number = serverVote.SOTWs;
            }

            let embed2 = new MessageEmbed()
              .setAuthor({
                name: `${user.username}'s Detailed Simp Card 🤓`,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              })
              .setColor("DARK_BUT_NOT_BLACK")
              .setThumbnail("https://i.imgur.com/vHJYmX0.png")
              .setDescription(
                `➜ __**${interaction.guild?.name}**__: \`${sv}\` **||** 𝘞𝘦𝘦𝘬𝘭𝘺: \`${svw}+\`\n• **Server Rank**: \`#${me.pos}\` **||** Server 𝘞𝘦𝘦𝘬𝘭𝘺: \`#${me2.pos}\`\n\n <a:Globe:786307253598814238> 𝐆𝐥𝐨𝐛𝐚𝐥 𝐕𝐨𝐭𝐞𝐬: 『 **${tagged.simpV}** 』**||** 𝙒𝙚𝙚𝙠𝙡𝙮: \`${tagged.sotw}+\`\n• __**Global Rank**__: \`#${globalrep.pos}\` **||** Global 𝘞𝘦𝘦𝘬𝘭𝘺: \`#${globalrepW.pos}\``
              )
              .setFooter({ text: `👉 ID: ${user.id}` })
              .setTimestamp();

            i.editReply({ embeds: [embed2] });
            return;
          }
        } else {
          const mee = await SOTWModel.findOne({ userID: user.id });
          if (!mee) {
            let embed2 = new MessageEmbed().setDescription(
              `You aren't a simp 😎 `
            );
            i.editReply({ embeds: [embed2] });
            return;
          } else {
            const serverVoteMe = mee.servers.find(
              (x: any) => x.serverID === interaction.guild?.id
            );
            if (!serverVoteMe) {
              var svMe = 0;
              var svwMe = 0;
            } else {
              var svMe: number = serverVoteMe.SVs;
              var svwMe: number = serverVoteMe.SOTWs;
            }
            let embed2 = new MessageEmbed()
              .setAuthor({
                name: `${user.username}'s Simp Votes 🤢`,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              })
              .setColor("DARK_BUT_NOT_BLACK")
              .setThumbnail("https://i.imgur.com/ixjIiHF.gif")
              .setFooter({
                text: `To get a more detailed Information about your Reps, become a Premium User`,
              })
              .setDescription(
                `➜ __**${interaction.guild?.name}**__: \`${svMe}\` **||** 𝘞𝘦𝘦𝘬𝘭𝘺: \`${svwMe}+\`\n\n <a:Globe:786307253598814238> 𝐆𝐥𝐨𝐛𝐚𝐥 𝐕𝐨𝐭𝐞𝐬: 『 **${mee.simpV}** 』**||** 𝙒𝙚𝙚𝙠𝙡𝙮: \`${mee.sotw}+\``
              );

            i.editReply({ embeds: [embed2] });
            return;
          }
        }
      } else if (i.customId === "modvotes") {
        await i.deferReply();

        if (userData?.premium) {
          let tagged = await MOTWModel.findOne({ userID: user.id });
          let memberz = (interaction.options.getMember("user") ||
            interaction.member) as GuildMember;

          if (!tagged) {
            if (!memberz.permissions.has("BAN_MEMBERS")) {
              i.editReply(
                "That person's not a Moderator <a:LmaoBlast:741346535358595072>"
              );
              return;
            } else {
              let embed2 = new MessageEmbed()
                .setAuthor({ name: `👮‍♂️ ${user.username}'s Mod Votes 👮‍♂️` })
                .setColor("BLUE")
                .setThumbnail("https://i.imgur.com/sPqDGwc.gif")
                .setDescription(
                  `${memberz.user} has 0 friggin' votes <:BruhMoji:784018093595820033> Maybe try being a better Moderator? `
                );
              i.editReply({ embeds: [embed2] });
              return;
            }
          } else {
            let data1 = await MOTWModel.find({}).sort({ modV: -1 });
            let globalrep = {
              pos: data1.findIndex((d: any) => d.userID == memberz.id) + 1,
            };
            data1 = data1.filter((d: any) =>
              // @ts-ignore
              Array.from(interaction.guild?.members.cache.keys()).includes(
                d.userID
              )
            );
            const me = {
              pos: data1.findIndex((d: any) => d.userID == memberz.id) + 1,
            };

            let data2 = await MOTWModel.find({}).sort({ motw: -1 });
            let globalrepW = {
              pos: data2.findIndex((d: any) => d.userID == memberz.id) + 1,
            };
            data2 = data2.filter((d: any) =>
              // @ts-ignore
              Array.from(interaction.guild?.members.cache.keys()).includes(
                d.userID
              )
            );
            const me2 = {
              pos: data2.findIndex((d: any) => d.userID == memberz.id) + 1,
            };

            let serverVote = tagged.servers.find(
              (x: any) => x.serverID === interaction.guild?.id
            );
            if (!serverVote) {
              var sv = 0;
              var svw = 0;
            } else {
              // @ts-ignore
              var sv: number = serverVote.MVs;
              // @ts-ignore
              var svw: number = serverVote.MOTWs;
            }
            if (memberz.permissions.has("BAN_MEMBERS")) {
              var modCheck = "✔️";
            } else {
              var modCheck = "❌";
            }

            let embed2 = new MessageEmbed()
              .setAuthor({
                name: `${user.username}'s Detailed Mod Votes 🤓`,
                iconURL: memberz.user.displayAvatarURL({ dynamic: true }),
              })
              .setColor("DARK_BUT_NOT_BLACK")
              .setThumbnail("https://i.imgur.com/vHJYmX0.png")
              .setDescription(
                `➜ __**${interaction.guild?.name}**__: \`${sv}\` **||** 𝘞𝘦𝘦𝘬𝘭𝘺: \`${svw}+\`\n• **Server Rank**: \`#${me.pos}\` **||** Server 𝘞𝘦𝘦𝘬𝘭𝘺: \`#${me2.pos}\`\n\n <a:Globe:786307253598814238> 𝐆𝐥𝐨𝐛𝐚𝐥 𝐕𝐨𝐭𝐞𝐬: 『 **${tagged.modV}** 』**||** 𝙒𝙚𝙚𝙠𝙡𝙮: \`${tagged.motw}+\`\n• __**Global Rank**__: \`#${globalrep.pos}\` **||** Global 𝘞𝘦𝘦𝘬𝘭𝘺: \`#${globalrepW.pos}\``
              )
              .setFooter({ text: `Moderator in this Guild: ${modCheck}` })
              .setTimestamp();

            i.editReply({ embeds: [embed2] });
            return;
          }
        } else {
          let memberz = (interaction.options.getMember("user") ||
            interaction.member) as GuildMember;
          let tagged = await MOTWModel.findOne({ userID: memberz.id });
          if (!tagged) {
            if (!memberz.permissions.has("BAN_MEMBERS")) {
              i.editReply(
                "That person's not a Moderator <a:LmaoBlast:741346535358595072>"
              );
              return;
            } else {
              let embed2 = new MessageEmbed()
                .setAuthor({
                  name: `👮‍♂️ ${memberz.user.username}'s Mod Votes 👮‍♂️`,
                })
                .setColor("BLUE")
                .setThumbnail("https://i.imgur.com/sPqDGwc.gif")
                .setDescription(
                  `${memberz.user} has 0 friggin' votes <:BruhMoji:784018093595820033> Maybe try being a better Moderator? `
                );
              i.editReply({ embeds: [embed2] });
              return;
            }
          } else {
            if (memberz.permissions.has("BAN_MEMBERS")) {
              var modCheck = "✔️";
            } else {
              var modCheck = "❌";
            }
            const serverVote = tagged.servers.find(
              (x: any) => x.serverID === interaction.guild?.id
            );
            if (!serverVote) {
              var sv: number = 0;
              var svw: number = 0;
            } else {
              // @ts-ignore
              var sv: number = serverVote.MVs;
              // @ts-ignore
              var svw: number = serverVote.MOTWs;
            }
            let embed2 = new MessageEmbed()
              .setAuthor({ name: `👮‍♂️ ${memberz.user.username}'s Mod Votes 👮‍♂️` })
              .setColor("BLUE")
              .setThumbnail("https://i.imgur.com/JZYZTZm.gif")
              .setDescription(
                `➜ __**${interaction.guild?.name}**__: \`${sv}\` **||** 𝘞𝘦𝘦𝘬𝘭𝘺: \`${svw}+\`\n\n <a:Globe:786307253598814238> 𝐆𝐥𝐨𝐛𝐚𝐥 𝐕𝐨𝐭𝐞𝐬: 『 **${tagged.modV}** 』**||** 𝙒𝙚𝙚𝙠𝙡𝙮: \`${tagged.motw}+\``
              )
              .setFooter({ text: `Moderator in this Guild: ${modCheck}` })
              .setTimestamp();

            i.editReply({ embeds: [embed2] });
            return;
          }
        }
      }
    });

    collector.on("end", () => {
      interaction.editReply({ components: [] });
    });
  }
}
