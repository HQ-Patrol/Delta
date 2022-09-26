import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { RoleModel as Roles } from "../../../database/models/RoleModel";
import userMonthly from "../../../database/models/UserMonthlyMissionsModel";

@ApplyOptions<Command.Options>({
  name: "russian-roulette",
  description:
    "Wanna play a game of classic Russian-Roulette where the winner gets Permanently banned?!",
})
export class CandyBadgeCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const Allow = await Roles.findOne({ id: interaction.guild?.id });
    if (Allow) {
      if (Allow.rr.length >= 1) {
        // @ts-ignore
        if (!interaction.member.roles.cache.has(Allow.rr[0].role)) {
          return interaction.reply({
            embeds: [
              {
                color: "RED",
                description: `You don't seem to have the required Role/Rank <@&${Allow.rr[0].role}> to use \`Russian-roulette\` command <a:exclamation:741988026296696872>`,
              },
            ],
          });
        }
      }
    }

    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    let embed = new MessageEmbed()
      .setColor("#ff2400")
      .setTitle("Russian Roulette was just started!")
      .setThumbnail("https://i.imgur.com/XlfbVG6.gif")
      .setDescription(
        `Join <@${interaction.user.id}>'s R-R game if you're not afraid to be IP banned <:EricaEvilPlotting:897841584647847986> __**Join now by reacting to**__ 🔫\n\n🙏\`Pray the loaded chamber does not align with the barrel on your turn!\`🙏`
      )
      .setFooter({ text: "6 Players needed" })
      .setTimestamp();
    let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    // @ts-ignore
    await msg.react("🔫");
    const filter = (reaction: any, user: any) =>
      reaction.emoji.name === "🔫" &&
      !(user.id === interaction.client.user?.id) &&
      !(user.id === interaction.user.id);
    // @ts-ignore
    const collector = msg.createReactionCollector({
      filter,
      time: 100000 /* any time you want */,
      maxUsers: 5,
    });
    collector.on("collect", (r: any) => {
      let theuserid = r.users.cache.lastKey();
      if (
        theuserid === interaction.user.id ||
        theuserid === interaction.client.user?.id
      )
        return;
      return interaction.editReply(`<@${theuserid}> has joined the game!`);
    });
    collector.on("end", async (collected: any) => {
      if (![...collected.values()][0])
        return interaction.editReply({
          content:
            "Not enough people joined the game <:WAH:740257222344310805> Grow some balls yall? 😒",
          embeds: [],
        });
      let ids = [...[...collected.values()][0].users.cache.keys()].filter(
        (id) => id !== interaction.client.user?.id && id !== interaction.user.id
      );
      ids.unshift(interaction.user.id);
      if (ids.length < 6 /* change to 6*/)
        return interaction.editReply({
          content:
            "Not enough people joined the game <:WAH:740257222344310805> Grow some balls yall? 😒",
          embeds: [],
        });
      let randnum = Math.floor(Math.random() * ids.length);

      let startmessage = "";
      for (let i = 0; i < ids.length; i++) {
        if (i == ids.length - 1)
          startmessage += `and <@${ids[i]}> joined and are part of this Russian-Roulette! ☠`;
        else startmessage += `<@${ids[i]}>, `;
      }

      const emb1 = new MessageEmbed()
        .setImage("https://i.imgur.com/bvYC1DB.gif")
        .setColor("DARK_BUT_NOT_BLACK")
        .setTitle("One bullet is loaded!")
        .setFooter({ text: "Muzzle is placed against your head..." })
        .setDescription(startmessage);

      await interaction.editReply({ embeds: [emb1] });
      for (let i = 5; i > 0; i--) {
        await sleep(1000);
        await interaction.editReply({ content: i + "...", embeds: [] });
      }
      await sleep(1000);
      try {
        let banned = ids[randnum];
        await interaction.guild?.members.ban(banned).catch(() => {
          interaction
            .editReply({
              content:
                "`Maybe that person couldn't be banned` <a:OhShitLookAtTheTimeWatch:751527814691553280>",
              embeds: [],
            })
            .then((n: any) => setTimeout(() => n.delete(), 5000));
        });
        const emb = new MessageEmbed()
          .setColor("DARK_BUT_NOT_BLACK")
          .setDescription(
            `<:RestInPiss:745740745058811904> <@${banned}> **met with an untimely demise** <:RestInPiss:745740745058811904>`
          );
        interaction.editReply({ embeds: [emb] });

        //Monthly Mission Section================
        if (interaction.user.id !== banned) {
          let monthlyDataW = await userMonthly.findOne({
            id: interaction.user.id,
          });
          if (!monthlyDataW) {
            await userMonthly.create({
              id: interaction.user.id,
              rr: {
                value: 1,
                wins: 1,
                loss: 0,
                prize: false,
                prizePlus: false,
              },
            });
          } else {
            if (monthlyDataW.rr.value > 0) {
              monthlyDataW.rr.value += 1;
            } else {
              monthlyDataW.rr.value = 1;
            }
            if (monthlyDataW.rr.wins > 0) {
              monthlyDataW.rr.wins += 1;
            } else {
              monthlyDataW.rr.wins = 1;
            }
            await monthlyDataW.save().catch((err: any) => console.log(err));
          }
        } //Monthly END=================================================================
      } catch (error) {
        interaction.editReply({
          content: `Whoops, an error occurred. This is most likely because the bot does not have permissions to ban the <@${ids[randnum]}>`,
          embeds: [],
        });
      }
      return;
    });
  }
}
