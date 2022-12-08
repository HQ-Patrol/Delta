import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageEmbed, GuildMember } from "discord.js";
import { User } from "../../../database/models/UserModel";
import pretty from "pretty-ms";
import { RepModel } from "../../../database/models/RepModel";
import config from "../../../config";
import UserMonthlyMissionsModel from "../../../database/models/UserMonthlyMissionsModel";
import UserWeeklyMissionsModel from "../../../database/models/UserWeeklyMissionsModel";

@ApplyOptions<Command.Options>({
  name: "rep",
  description: "Give or remove a Social Credit to someone who you like.",
})
export class RepCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("Give a social credit to someone who you like.")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to give a social credit to.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription(
              "Remove a social credit from someone who you don't like."
            )
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to take a social credit from.")
                .setRequired(true)
            )
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      let userData = await User.findOne({ id: interaction.user.id });
      if (!userData)
        userData = await User.create({
          id: interaction.user.id,
          premium: false,
          blacklisted: false,
        });
      const cooldownTime = 82800000;
      const PremiumcooldownTime = cooldownTime / 2;

      const memberz = interaction.options.getMember("user") as GuildMember;
      if (!memberz) {
        const userCooldown2 = userData.Biggercooldown.find(
          (x: any) => x.command === "rep"
        );
        if (!userCooldown2 || userCooldown2.endCooldown <= Date.now()) {
          return interaction.reply("Couldn't find that member!");
        }
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before giving Social Credits to someone else! <a:RedTick:736282199258824774>`
                ),
            ],
          })
          .catch(console.error);
      }

      if (memberz.user.bot)
        return interaction.reply({
          content: "You didn't possibly just try that😐",
          ephemeral: true,
        });

      if (memberz.id === interaction.user.id) {
        return interaction.reply(
          "<:WAH:740257222344310805> You can't give Social Credits to yourself loser <:WAH:740257222344310805>"
        );
      }

      const userCooldown2 = userData.Biggercooldown.find(
        (x: any) => x.command === "rep"
      );
      if (!userCooldown2) {
        return interaction.reply(
          `*Looks like you still haven't received your __**Voter ID Card**__ yet 😮*, **Type:** \`/voterid\` to start voting <a:GoVote:787376884731478046>`
        );
      }

      if (userCooldown2.endCooldown > Date.now()) {
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before giving Social Credits to someone else! <a:RedTick:736282199258824774>`
                ),
            ],
          })
          .catch(console.error);
      } else {
        const tagged = await RepModel.findOne({ userID: memberz.id });
        if (!tagged) {
          await RepModel.create({
            userID: memberz.id,
            username: memberz.user.username,
            rep: 1,
            repW: 1,
            repper: [
              {
                Repper: interaction.user.id,
                RepperServer: interaction.guild?.id,
                Time: interaction.createdAt,
              },
            ],
          });
          if (config.commanders.includes(interaction.user.id)) {
            userCooldown2.endCooldown = Date.now();
          } else if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }

          let embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `<a:Increase:943232833521057824> **|| ${interaction.user.username} awarded Social Credit to ${memberz.user}** <:SocialCreditsAdded:943232099111034892>`
            );
          interaction.reply({ embeds: [embed] });
          await userData.save().catch((err: any) => console.log(err));

          return;
        }

        if (config.commanders.includes(interaction.user.id)) {
          userCooldown2.endCooldown = Date.now();
        } else if (userData.premium === true) {
          userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
        } else {
          userCooldown2.endCooldown = Date.now() + cooldownTime;
        }

        let embed = new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `<a:Increase:943232833521057824> **|| ${interaction.user.username} awarded Social Credit to ${memberz.user}** <:SocialCreditsAdded:943232099111034892>`
          );
        interaction.reply({ embeds: [embed] });

        tagged.repper.unshift({
          Repper: interaction.user.id,
          RepperServer: interaction.guild?.id,
          Time: interaction.createdAt,
        });
        if (tagged.repper.length > 5) {
          tagged.repper.pop();
        }
        tagged.repW = tagged.repW + 1;
        tagged.rep = tagged.rep + 1;

        tagged.save().catch((err: any) => console.log(err));
        await userData.save().catch((err: any) => console.log(err));

        //MONTHLY DATA SECTION========================
        let monthlyData = await UserMonthlyMissionsModel.findOne({
          id: memberz.id,
        }); //Author
        if (!monthlyData) {
          await UserMonthlyMissionsModel.create({
            id: memberz.id,
            rep: {
              value: 1,
              users: [`${interaction.user.id}`],
              prize: false,
              prizePlus: false,
            },
          });
        } else {
          let FindPerson1 = monthlyData.rep.users.indexOf(
            `${interaction.user.id}`
          );
          if (FindPerson1 == -1) {
            if (monthlyData.rep.value > 0) {
              monthlyData.rep.value += 1;
            } else {
              monthlyData.rep.value = 1;
            }
            monthlyData.rep.users.push(interaction.user.id);
            await monthlyData.save().catch((err: any) => console.log(err));
          } else {
          }
        }

        return;
      }
    } else if (subcommand === "remove") {
      let userData = await User.findOne({ id: interaction.user.id });
      if (!userData)
        userData = await User.create({
          id: interaction.user.id,
          premium: false,
          blacklisted: false,
        });
      const cooldownTime = 82800000;
      const PremiumcooldownTime = cooldownTime / 2;

      const memberz = interaction.options.getMember("user") as GuildMember;
      if (!memberz) {
        const userCooldown2 = userData.Biggercooldown.find(
          (x: any) => x.command === "derep"
        );
        if (!userCooldown2 || userCooldown2.endCooldown <= Date.now()) {
          return interaction.reply("Couldn't find that member!");
        }
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before you can de-rep someone again.`
                ),
            ],
          })
          .catch(console.error);
      }

      if (memberz.user.id === interaction.client?.user?.id)
        return interaction.reply({
          content: "AYO chill <:SocialCreditsGone:912700874499977227>",
        });
      if (memberz.user.bot)
        return interaction.reply("I hate it too, f that bot.");
      if (memberz.id === interaction.user.id) {
        return interaction.reply(
          "Attention seeking seems like a personality trait of yours <:RiceCat:943263984616873995>"
        );
      }
      //if (userData.premium===false) { return interaction.reply("Nice try simp but this is a Premium-only command 🥱");}

      const tagged = await RepModel.findOne({ userID: memberz.id });
      if (!tagged) {
        return interaction.reply(
          "They have 0 Social Credits <:WAAAAAAAAAAAAHHHHHRGHHH:816742683535605780>"
        );
      }

      const userCooldown2 = userData.Biggercooldown.find(
        (x: any) => x.command === "derep"
      );
      if (!userCooldown2) {
        return interaction.reply(
          `*Looks like you still haven't received your Voter ID Card yet 😮*, **Type:** \`/voterid\` to start voting <a:GoVote:787376884731478046>`
        );
      }

      if (userCooldown2.endCooldown > Date.now()) {
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before you can de-rep someone again.`
                ),
            ],
          })
          .catch(console.error);
      } else {
        if (userData.premium === true) {
          userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
        } else {
          userCooldown2.endCooldown = Date.now() + cooldownTime;
        }

        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#660000")
              .setDescription(
                `<:SocialCreditsGone:912700874499977227> | **${interaction.user.username} took away ${memberz.user}'s Social Credits** <a:Decrease:943232879641645056>`
              )
              .setImage("https://i.imgur.com/VKjtzrr.gif"),
          ],
        });

        tagged.Derepper.unshift({
          DeRepper: interaction.user.id,
          DeRepperServer: interaction.guild?.id,
          Time: interaction.createdAt,
        });
        if (tagged.Derepper.length > 5) {
          tagged.Derepper.pop();
        }
        tagged.rep = tagged.rep - 1;

        tagged.save().catch((err: any) => console.log(err));
        await userData.save().catch((err: any) => console.log(err));

        //WEEKLY DATA SECTION========================
        let weeklyData = await UserWeeklyMissionsModel.findOne({
          id: interaction.user.id,
        }); //Author
        if (!weeklyData) {
          await UserWeeklyMissionsModel.create({
            id: interaction.user.id,
            derep: {
              value: 1,
              users: [`${memberz.id}`],
              prize: false,
              prizePlus: false,
            },
          });
        } else {
          let FindPerson1 = weeklyData.derep.users.indexOf(`${memberz.id}`);
          if (FindPerson1 == -1) {
            /*Success*/
            if (weeklyData.derep.value > 0) {
              weeklyData.derep.value += 1;
            } else {
              weeklyData.derep.value = 1;
            }
            weeklyData.derep.users.push(memberz.id);
            await weeklyData.save().catch((err: any) => console.log(err));
          } else {
            /*FAIL*/ weeklyData.derep.value += 1;
            await weeklyData.save().catch((err: any) => console.log(err));
          }
        }

        return;
      }
    }
  }
}
