import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";

@ApplyOptions<Command.Options>({
  name: "candylb",
  description: "Check who's the charts topper in all servers!",
})
export class CandyLbCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("What's the type?")
            .setRequired(true)
            .addChoices(
              {
                name: "Candy",
                value: "candy",
              },
              {
                name: "Packages",
                value: "packages",
              },
              {
                name: "Stones",
                value: "stones",
              },
              {
                name: "Snaps",
                value: "snaps",
              }
            )
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const type = interaction.options.getString("type");
    const msg = await interaction.deferReply();

    const random = [
      "https://i.imgur.com/f26xSQF.gif",
      "https://i.imgur.com/mvyOrzb.gif",
      "https://i.imgur.com/BuIV2p7.gif",
      "https://i.imgur.com/a4jOspD.gif",
    ];
    const gif = random[Math.floor(Math.random() * random.length)];

    const can = await Candy.find();
    const embed1 = new MessageEmbed();
    if (!can) {
      embed1.setColor("RED");
      embed1.setDescription("`╔══ No data found ══╗`");
      return interaction.editReply({ embeds: [embed1] });
    }

    if (
      type === "cc" ||
      type === "candies" ||
      type === "candycount" ||
      type === "candy"
    ) {
      const allplayers = await Candy.find();
      const sortedplayers = allplayers.sort(
        (player1: any, player2: any) => player2.CandyCount - player1.CandyCount
      );
      const sortedids = sortedplayers.map((player: any) => player.id);
      const embedarray = [];
      for (let i = 0; i < Math.ceil(sortedplayers.length / 5); i++) {
        let array = sortedplayers.slice(i * 5, i * 5 + 5);
        const you = await Candy.findOne({ id: interaction.user.id });
        // @ts-ignore
        array = array.map((player: any) => {
          const place = sortedids.indexOf(player.id) + 1;
          return `**#${place}** • <@${player.id}> [${
            player.id
          }] <:WavyDash:760469258093723689> **${player.CandyCount}** ${
            player.CandyCount === 1 ? `candy` : `candies`
          }`;
        });
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("🧁🍫 CANDY LEADERBOARD 🍬🍭")
          .setThumbnail(gif)
          .setTimestamp()
          .setDescription(array.join("\n"));
        if (you) {
          embed.addField(
            `╔══ You • ${you.CandyCount} 🍬 ══╗`,
            `ᴛʏᴘᴇ: \`/𝚝𝚛𝚒𝚌𝚔𝚘𝚛𝚝𝚛𝚎𝚊𝚝\` ᴛᴏ ᴄᴏʟʟᴇᴄᴛ ꜱᴏᴍᴇ ᴄᴀɴᴅɪᴇꜱ! <:Skittles1:747102800835641435><:Skittles2:747102801221517452>`
          );
        }
        embedarray.push(embed);
      }
      // @ts-ignore
      return interaction.editReply({ embeds: embedarray });
      //new Paginator(message.channel, embedarray, 'Page').paginate()
    } else if (
      type === "pkg" ||
      type === "package" ||
      type === "packages" ||
      type === "pack" ||
      type === "packs"
    ) {
      const allplayers = await Candy.find();
      const sortedplayers = allplayers.sort(
        (player1: any, player2: any) => player2.Package - player1.Package
      );
      const sortedids = sortedplayers.map((player: any) => player.id);
      const embedarray = [];
      for (let i = 0; i < Math.ceil(sortedplayers.length / 5); i++) {
        let array = sortedplayers.slice(i * 5, i * 5 + 5);
        const you = await Candy.findOne({ id: interaction.user.id });
        //if (you) array.push(you)
        // @ts-ignore
        array = array.map((player: any) => {
          const place = sortedids.indexOf(player.id) + 1;
          return `**#${place}** • <@${player.id}> [${
            player.id
          }] <:WavyDash:760469258093723689> **${player.Package}** ${
            player.Package === 1 ? `package` : `packages`
          }`;
        });
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("🍬 PACKAGES LEADERBOARD 🎁")
          .setThumbnail(gif)
          .setTimestamp()
          .setDescription(array.join("\n"));
        if (you) {
          embed.addField(
            `╔══ You • ${you.Package} 🎁 ══╗`,
            `ᴄᴏʟʟᴇᴄᴛ 1 ᴏꜰ ᴇᴠᴇʀʏ ᴄᴀɴᴅʏ ᴀɴᴅ ᴛʏᴘᴇ: \`/𝙲𝚊𝚗𝚍𝚢𝙿𝚊𝚌𝚔\` ᴛᴏ ᴍᴀᴋᴇ ᴀ ᴄᴀɴᴅʏ ᴘᴀᴄᴋᴀɢᴇ! 🎁`
          );
        }
        embedarray.push(embed);
      }
      // @ts-ignore
      return interaction.editReply({ embeds: embedarray });
      //new Paginator(message.channel, embedarray, 'Page').paginate()
    } else if (type === "snap" || type === "snaps") {
      const allplayers = await Candy.find();
      const sortedplayers = allplayers.sort(
        (player1: any, player2: any) => player2.Snap - player1.Snap
      );
      const embedarray = [];
      for (let i = 0; i < Math.ceil(sortedplayers.length / 5); i++) {
        let array = sortedplayers.slice(i * 5, i * 5 + 5);
        const you = await Candy.findOne({ id: interaction.user.id });
        // @ts-ignore
        array = array.map((player: any) => {
          const place =
            sortedplayers.findIndex((x: any) => x.id === player.id) + 1;
          return `**#${place}** • <@${player.id}> [${
            player.id
          }] <:WavyDash:760469258093723689> **${player.Snap}** ${
            player.Snap === 1 ? `snap` : `snaps`
          }`;
        });
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("✊ SNAPS LEADERBOARD 💥")
          .setThumbnail(gif)
          .setTimestamp()
          .setDescription(array.join("\n"));
        if (you) {
          embed.addField(
            `╔══ You • ${you.Snap} ✨ ══╗`,
            `ᴄᴏʟʟᴇᴄᴛ ᴀʟʟ 6 ɪɴꜰɪɴɪᴛʏ ꜱᴛᴏɴᴇꜱ ᴀɴᴅ ᴛʏᴘᴇ: \`/𝙲𝚊𝚗𝚍𝚢𝚂𝚗𝚊𝚙\` ᴛᴏ ᴡɪɴ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏꜱ, ɢɪꜰᴛᴄᴀʀᴅꜱ, ᴏʀ ᴄᴏɪɴꜱ! <a:StoneSnap:760232908216074290>`
          );
        }
        embedarray.push({ embeds: [embed] });
      }
      // @ts-ignore
      return interaction.editReply({ embeds: embedarray });
      //new Paginator(message.channel, embedarray, 'Page').paginate()
    } else if (type === "stone" || type === "stones" || type === "infinity") {
      const allplayers = await Candy.find();
      const stonecount = (player: any) => {
        return Object.entries(player.candy)
          .filter((x) => x[0].endsWith("stone"))
          .map((x) => x[1])
          .reduce((acc: any, cur: any) => acc + cur);
      };
      const sortedplayers = allplayers.sort(
        (player1: any, player2: any) =>
          // @ts-ignore
          stonecount(player2) - stonecount(player1)
      );
      const sortedids = sortedplayers.map((player: any) => player.id);
      const embedarray = [];
      for (let i = 0; i < Math.ceil(sortedplayers.length / 5); i++) {
        let array = sortedplayers.slice(i * 5, i * 5 + 5);
        const you = await Candy.findOne({ id: interaction.user.id });
        // @ts-ignore
        array = array.map((player: any) => {
          const place = sortedids.indexOf(player.id) + 1;
          return `**#${place}** • <@${player.id}> [${
            player.id
          }] <:WavyDash:760469258093723689> **${stonecount(player)}** ${
            stonecount(player) === 1 ? `stone` : `stones`
          }`;
        });
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("✊ STONE LEADERBOARD 🍬")
          .setThumbnail(gif)
          .setTimestamp()
          .setDescription(array.join("\n"));
        if (you) {
          embed.addField(
            `╔══ You • ${stonecount(you)} 🍬 ══╗`,
            `ᴛʏᴘᴇ: \`/𝚝𝚛𝚒𝚌𝚔𝚘𝚛𝚝𝚛𝚎𝚊𝚝\` ᴛᴏ ᴄᴏʟʟᴇᴄᴛ ꜱᴏᴍᴇ ᴄᴀɴᴅɪᴇꜱ! <:Skittles1:747102800835641435><:Skittles2:747102801221517452>`
          );
        }
        embedarray.push(embed);
      }
      // @ts-ignore
      return interaction.editReply({ embeds: embedarray });
      //new Paginator(message.channel, embedarray, 'Page').paginate()
    }
    // @ts-ignore
    msg.delete();
  }
}
