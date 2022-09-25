import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import humanizeDuration from "humanize-duration";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { EventModel as Event } from "../../../database/models/EventModel";
import { MessageEmbed, TextChannel } from "discord.js";
import ALL from "../../../data/json/redeem.json";

const simped = new Map();

@ApplyOptions<Command.Options>({
  name: "trickortreat",
  description:
    "Hunt for Candies and collect all the most rarest and tastiest of them!",
})
export class TrickOrTreatCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    /* interaction.reply({
      embeds: [
        new MessageEmbed().setDescription(
          "<:CandyHunter2021:896032392903524372> **Thanks for participating in Halloween Event 2021 but just like all good things, it has ENDED :smile: It was a Massive Success, we really hope you enjoyed it and collected loads of Candies** <a:Candy5:747106216781676614>"
        ),
      ],
    }); */

    await interaction.deferReply();

    const randomFooter = [
      "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁",
      "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁",
      "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁",
      "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁",
      "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁",
      "ꜱᴜʙᴍɪᴛ ʏᴏᴜʀ ᴏᴡɴ !ᴛᴏᴘɪᴄꜱ",
      "ᴠɪꜱɪᴛ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ ✨",
      "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!",
      "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!",
      "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟",
      "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟",
      "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟",
      "!ꜱꜰᴡ ᴏɴ ʀᴇᴍᴏᴠᴇs ᴛʜᴇ 🔞",
      "!ᴛᴄᴍᴅ ᴅɪsᴀʙʟᴇꜱ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ",
      "!ᴄʜɪʙɪ ᴛᴏ ʀᴇᴅᴜᴄᴇ ɢɪꜰ ꜱɪᴢᴇ",
      "ᴛʜᴇʀᴇ'ꜱ ᴇᴀꜱᴛᴇʀ ᴇɢɢꜱ ᴛᴏᴏ?!🤐",
      "!ʜᴇʟᴘ <ᴄᴍᴅ> ɪꜱ ʜᴇʟᴘꜰᴜʟ",
      "!50-50 ᴛᴏ ꜱᴇᴇ ɢᴏʀᴇ ☠",
      "!ᴜᴘᴅᴀᴛᴇꜱ ꜰᴏʀ ɴᴇᴡ ɪɴꜰᴏ",
      "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)",
      "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)",
      "'!ʀᴇᴘꜱ ɪɴꜰᴏ' ꜰᴏʀ ᴇxᴛʀᴀ 📚🤓",
      "ʏᴏᴜ ʟᴏꜱᴇ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛᴀxᴇꜱ ᴇᴠᴇʀʏᴅᴀʏ!",
      "ʀᴇᴘᴏʀᴛ ᴀɴʏ ʙᴜɢ ʙʏ !ʙᴜɢʀᴇᴘᴏʀᴛ ꜰᴏʀ 🍪",
      "ᴘʀᴇᴍɪᴜᴍ ɪꜱ ᴊᴜꜱᴛ $3.99/ᴍᴏɴᴛʜ🌟(ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ)",
      "ᴄᴏᴅᴇ: 'ʟᴇᴛꜱɢᴏ' ꜰᴏʀ 10% ᴏꜰꜰ (ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ) 💲",
      "ᴏᴘᴇɴ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ᴛᴏ ʟᴇᴠᴇʟ ᴜᴘ ꜰᴀꜱᴛ!",
      "!ʙᴏᴏꜱᴛᴇʀs ᴛᴏ ᴇᴀʀɴ ᴀ ᴅᴀɪʟʏ ᴍʏꜱᴛᴇʀʏ ʙᴏx & ᴄᴏɪɴꜱ 😋",
      "ᴛʏᴘᴇ: !ᴄᴍᴅꜱ ᴛᴏ ɢᴇᴛ ʟɪꜱᴛ ᴏꜰ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ 🤩",
      "'!ᴛᴄᴍᴅ ʀᴏʙ' ᴛᴏ ᴅɪꜱᴀʙʟᴇ ᴀʟʟ ʀᴏʙʙɪɴɢ ɪɴ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀ 🚔",
      "!ꜱᴇᴛᴄʀᴜᴄɪꜰʏ ᴛᴏ ᴄʜᴀɴɢᴇ ᴄʀᴜᴄɪꜰʏ ʟɪᴍɪᴛ",
      "Always do !ᴛᴀꜱᴋ ɪɴꜰᴏ <ᴄᴏᴅᴇ> more starting a mission!",
      "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜",
      "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜",
      "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜",
      "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁",
      "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁",
      "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁",
      "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁",
      "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ",
      "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ",
      "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰",
      "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰",
      "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰",
      "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏",
      "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏",
    ];
    const FOOTER = randomFooter[Math.floor(Math.random() * randomFooter.length)];

    const cooldown = simped.get(interaction.user.id);

    if (cooldown) {
      const remaining = humanizeDuration(cooldown - Date.now(), {
        units: ["h", "m", "s"],
        round: true,
      });
      return interaction
        .reply(
          `${interaction.user}, Wait \`${remaining}\` before using candy hunting again! <a:RedTick:736282199258824774>`
        )
        .catch(console.error);
    } else {
      const randomCandy = [
        `${interaction.user} broke into neighbours house and robbed himself some `,
        `${interaction.user}'s costume was pretty neat which earned him some `,
        `${interaction.user} visited a Groomer's house and got ALOT of `,
        `Police arrested ${interaction.user}'s mom for drunk driving over a family of 4 but you got some `,
        `${interaction.user} found something lying outside their house. Oh cool it's `,
        `${interaction.user}'s grandma came in clutch 😼 Love you grandma, for bringing some `,
        `You visited Patrol Bot HQ and got some cum flavored `,
        `${interaction.user} was part of a 4 member candy-hunt event and uncovered some `,
        `${interaction.user} visited their therapist after having constant suicidal thoughts and she gave him some Anti-depressants & `,
        `${interaction.user} got into a fight with a homeless person and robbed him off some`,
        `${interaction.user} started doing Yoga and manifested some `,
        `Some Canadians crossed path with ${interaction.user} and gifted them `,
        `For Agree-ing that The right way to eat cereals is pouring the milk first, ${interaction.user} received a letter about Scholarship to Yale, wait it's just some `,
        `${interaction.user} + Funny incident + Candy Name: `,
        `${interaction.user} went into the woods, found a huge mfin Candy Tree and collected some `,
        `${interaction.user} got divorced, lost their kids but got some `,
        `Hey, it's me DaBaby <:HolyShitDaBaby:893163949187539005> LETSGOOOOO! Before I turn into a convertible, here's ${interaction.user}'s  `,
      ];
      const gifCandy =
        randomCandy[Math.floor(Math.random() * randomCandy.length)];

      const randomEmote = [
        "<:Skittles1:747102800835641435><:Skittles2:747102801221517452>",
        "<a:Candy1:747106214273613824>",
        "<a:Candy2:747106214407569509>",
        "<a:Candy3:747106214500106332>",
        "<a:Candy4:747106215250886797>",
        "<a:Candy5:747106216781676614>",
        "<a:Candy6:747106220221005824>",
        "<:Candy7:747106217838510141>",
      ];
      const emote = randomEmote[Math.floor(Math.random() * randomEmote.length)];

      let random = Math.floor(Math.random() * 5000) + 1;
      const embed = new MessageEmbed();
      const probabilities = {
        5000: [
          "spacestone",
          "266EF6",
          `Where's that blue glow coming from?! 😲`,
          "**You went looking for candy but stumbled across the __Space Stone__ <:SpaceStone:759495194248216629> You suddenly have a great urge to travel through the universe but you also have to be home before sunset** 😥",
          "https://i.imgur.com/Dn7ug6K.gif",
          false,
        ],
        4998: [
          "timestone",
          "35B535",
          `What's with that green glow doe?! 😯`,
          "**That's one strange rock. Wait, it's a fricking __Time Stone__ <:TimeStone:759495193262293023> !! It's finally your time to shine** 😎",
          "https://i.imgur.com/ML7Dq19.gif",
          false,
        ],
        4995: [
          "realitystone",
          "#8B0000",
          `That red glow isn't normal? 🤯`,
          "**Your little trip to walmart turned out to be well-worth it! You found yourself a __Reality stone__ <:RealityStone:759495193778454538> `How does someone's reality involve buying grocery from walmart doe** 😭` ",
          "https://i.imgur.com/cZiDGLN.gif",
          false,
        ],
        4992: [
          "soulstone",
          "#FFFF00",
          `Why my Fiji Water yellow?? 😠`,
          "**While you were about to drink from your bottle, turns out it had a __Soul stone__ <:SoulStone:759495193493504040> inside it. That's quite a rare discovery ngl!** 🤩",
          "https://i.imgur.com/ccSehI9.gif",
          false,
        ],
        4989: [
          "mindstone",
          "#FFA500",
          `What's that thing in your dog's mouth? 😕`,
          "**Your dog somehow found the __Mind stone__ <:MindStone:759495192998313984> and brought it to you. Use it wisely!**",
          "https://i.imgur.com/Qx0NMyH.gif",
          false,
        ],
        4986: [
          "powerstone",
          "#800080",
          `This candy got a purple glow?? 😐`,
          "**You unwrapped a candy your crush gave you but turns out it's a Mfin __Power Stone__ <:PowerStone:759495194168655882> Lowkey a bruh moment.**",
          "https://i.imgur.com/ql7ZXCA.gif",
          false,
        ],
        4889: [
          "wonkabar",
          "#D2691E",
          `Candy hunt was a success! But wait, is that a Wonka bar?! 🍫`,
          "Oh shit Willy Wonka himself came to bless your halloween! You're the golden child 🥰💌",
          "https://i.imgur.com/rGDwkPL.gif",
          true,
        ],
        4739: [
          "pocky",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Pocky** " + emote,
          "https://i.imgur.com/IMRPP7K.png",
        ],
        4549: [
          "bonbon",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**BonBons** " + emote,
          "https://i.imgur.com/TW1kPhB.jpg",
        ],
        4349: [
          "candybutton",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Candy Buttons** " + emote,
          "https://i.imgur.com/ZmamLeU.png",
        ],
        4149: [
          "candycane",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Candy Canes** " + emote,
          "https://i.imgur.com/ZmamLeU.png",
        ],
        3949: [
          "marshmallow",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Marshmallow** " + emote,
          "https://i.imgur.com/FpeK5Jl.jpg",
        ],
        3749: [
          "bubblegum",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Bubblegum** " + emote,
          "https://i.imgur.com/yECdXoa.jpg",
        ],
        3549: [
          "gumball",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Gumballs** " + emote,
          "https://i.imgur.com/dTRp0Eh.jpg",
        ],
        3349: [
          "gummybear",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Gummy bears** " + emote,
          "https://i.imgur.com/vmffeh7.jpg",
        ],
        3149: [
          "jellybean",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Jelly Beans** " + emote,
          "https://i.imgur.com/3exII6p.jpg",
        ],
        2949: [
          "jawbreaker",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Jawbreaker** " + emote,
          "https://i.imgur.com/YLwEXcw.png",
        ],
        2749: [
          "jollyrancher",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Jolly Rancher** " + emote,
          "https://i.imgur.com/WRkAyT5.jpg",
        ],
        2549: [
          "lollipop",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Lollipop** " + emote,
          "https://i.imgur.com/yiQz7iq.png",
        ],
        2349: [
          "mintcandy",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Mint** " + emote,
          "https://i.imgur.com/GYxOYID.png",
        ],
        2149: [
          "toffee",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Toffee** " + emote,
          "https://i.imgur.com/pKKGpN6.png",
        ],
        1949: [
          "candystick",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Candy Sticks** " + emote,
          "https://i.imgur.com/7wjEVU5.png",
        ],
        1873: [
          "sourpatch",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Sour Patch** " + emote,
          "https://i.imgur.com/JOm10vk.png",
        ],
        1725: [
          "skittle",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Skittles** " + emote,
          "https://i.imgur.com/9B2K5zR.png",
        ],
        1613: [
          "chocolate",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Chocolates** " + emote,
          "https://i.imgur.com/DC6WhVq.jpg",
        ],
        1501: [
          "caramel",
          "RANDOM",
          `Candy hunt was a success! 🍬`,
          gifCandy + "**Caramel** " + emote,
          "https://i.imgur.com/1pP0aaf.jpg",
        ],
      };
      const keys = Object.keys(probabilities).map((x) => parseInt(x));
      let arr: any;
      for (let i = 0; i < keys.length; i++) {
        if (random < keys[i]) continue;
        while (keys.indexOf(random) < 0 && random > keys[0]) {
          random--;
        }
        // @ts-ignore
        arr = probabilities[random];
        if (!arr) continue;
        embed.setColor(arr[1]).setTitle(arr[2]);
        if (arr[5] === false) embed.setFooter("• Time Left: 15s ⏱");
        else embed.setFooter({ text: `➤ ` + FOOTER });
        if (arr[5] === false)
          embed.setDescription(
            `<a:ThanosDance:763468378794754049> ‼ __**Type**__: \`THERE WAS NO OTHER WAY\` **to Obtain the Infinity Stone** ‼ <a:ThanosDance:763468378794754049>`
          );
        else
          embed.setDescription(
            `${arr[3]}\n**\`• Type:\`**\`/𝙘𝙖𝙣𝙙𝙮𝙗𝙖𝙜 to check your total candies🧁\``
          );
        if (arr[5] === false) embed.setImage("");
        else if (arr[0] === "wb") embed.setImage(arr[4]);
        else embed.setThumbnail(arr[4]);
        break;
      }
      let currentcandy = await Candy.findOne({
        id: interaction.user.id,
      }).exec();
      if (!currentcandy) {
        currentcandy = await Candy.create({ id: interaction.user.id });
        await interaction.editReply(
          `\`You just picked up your Candy bag 🎒 and started your quest of collecting tastiest and most candies! Sweet :)\``
        );
      }
      let multiplier;

      if (Date.now() > currentcandy.boosterResetDate) {
        currentcandy.boosterResetDate = 0;
        currentcandy.booster = 0;
        await currentcandy.save();
      }
      const booster = currentcandy.booster;
      if (booster > 0) multiplier = booster;
      else multiplier = 1;
      if (!embed.title) {
        embed.setColor("RED");
        embed.setTitle(`You failed to get any candy!`);
        embed.setDescription(
          "You got tricked and went back home empty-handed 😭"
        );
      } else {
        if (multiplier > 1 && !arr[0].endsWith("stone"))
          embed.setDescription(
            embed.description +
              `\n➛ *Your multiplier took effect and you got \`x${multiplier}\` the candies!*`
          );

        //=========== Wonka bar addition with/without multiplier =============
        if (arr[0] === "wonkabar")
          await Candy.findOneAndUpdate(
            { id: interaction.user.id },
            {
              candy: Object.assign(currentcandy.candy, {
                [arr[0]]:
                  // @ts-ignore
                  currentcandy.candy[arr[0]] +
                  (arr[0] === "wonkabar" ? multiplier : 1),
              }),
              CandyCount:
                currentcandy.CandyCount +
                (arr[0] === "wonkabar" ? multiplier : 0),
            }
          );
        else if (arr[5] === false) {
          //======= New lines //To have that 'grab' thing everytime you encounter a STONE (addition) =========
          const filter = (m: any) =>
            !m.author.bot &&
            m.content.toLowerCase() == "there was no other way";
          const collector = (
            interaction.channel as TextChannel
          ).createMessageCollector({
            filter,
            time: 15000,
            max: 1,
          });
          let xyz = false;
          collector.on("collect", async (m: any) => {
            xyz = !xyz;
            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setAuthor(
                    `${m.author.username} Secured the Stone 🤘`,
                    m.author.displayAvatarURL({ dynamic: true })
                  )
                  .setColor(arr[1])
                  .setImage(arr[4])
                  .setDescription(arr[3])
                  .setFooter({
                    text: "• 𝘛𝘺𝘱𝘦: /𝙘𝙖𝙣𝙙𝙮𝙗𝙖𝙜 𝘵𝘰 𝘤𝘩𝘦𝘤𝘬 𝘺𝘰𝘶𝘳 𝘵𝘰𝘵𝘢𝘭 𝘤𝘢𝘯𝘥𝘪𝘦𝘴🧁",
                  }),
              ],
            });
            const poppings = await Candy.findOne({ id: m.author.id });
            if (!poppings) {
              interaction.editReply(
                `had no bag to store the stone so it vanished...`
              );
            } else {
              // @ts-ignore
              poppings.candy[arr[0]] = poppings.candy[arr[0]] + 1;
              await poppings.save();
              await (
                interaction.client.channels.cache.get(
                  "892081659527172146"
                ) as TextChannel
              ).send(
                `User <@${m.author.id}> [${m.author.id}] found a **${arr[0]}** : ${interaction.guild} [${interaction.guild?.id}]`
              );
            }
          });
          collector.on("end", async () => {
            if (!xyz)
              await interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor("#FF0000")
                    .setTitle("Timeout! ⏰")
                    .setDescription(
                      "You took too long and the Inifnity Stone Vanished <a:Troll_Smile:858755953956880396>"
                    ),
                ],
              });
          });
        }
        //=========== For a normal candy addition with/without multiplier both ===========
        else
          await Candy.findOneAndUpdate(
            { id: interaction.user.id },
            {
              candy: Object.assign(currentcandy.candy, {
                // @ts-ignore
                [arr[0]]: currentcandy.candy[arr[0]] + multiplier,
              }),
              CandyCount: currentcandy.CandyCount + multiplier,
            }
          );
      }
      await interaction.editReply({ embeds: [embed] });

      //EVENTS---------
      const random2 = Math.floor(Math.random() * 100000) + 1;
      //let random2 = 100000;
      let event = await Event.findOne().exec();
      if (!event) event = await Event.create({});

      if ((random2 === 50000 || random2 === 55555) && event.X1 < 10) {
        const msgX1 = await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `${interaction.user}, __**Type**__: \`TRICK-OR-TREAT\` **to receive the Special present from Patrol Bot <:Skittles1:747102800835641435><:Skittles2:747102801221517452>** ‼`
              )
              .setFooter({ text: `Time Left: 20s ⏰` }),
          ],
        });
        const filter = (m: any) =>
          m.author.id === interaction.user.id &&
          m.content.toLowerCase() == "trick-or-treat"; // @ts-ignore
        const collector = msgX1.channel.createMessageCollector(filter, {
          time: 20000,
          max: 1,
        });
        let xyz = false;
        collector.on("collect", async () => {
          xyz = !xyz; // @ts-ignore
          msgX1.delete();
          await interaction.editReply(
            `<a:Tada:760515869603790928> __**You're one in a million! Enjoy your 5 Free Candy Bundles :)  Well cking done**__ <:CandyBundle:892128278373093396>`
          );

          let resX1 = "";
          for (const d of ALL.GOD) {
            if (String(d).startsWith("X1")) resX1 = `${d}`;
            if (resX1 !== "") break;
          }
          interaction.user
            .send(
              `__**Candy Bundles Code**__: \`${resX1}\`\n\nUse command \`!Redeem ${resX1}\` and accept your prize within 60 minutes or it expires!`
            )
            .catch(() =>
              interaction.editReply(
                "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
              )
            ); //Redeem Code DM
          await (
            interaction.client.channels.cache.get(
              "892081659527172146"
            ) as TextChannel
          ).send(
            `<@${interaction.user.id}> \`[${
              interaction.user.id
            }]\` got Candy Bundle! \nGuild: ${
              interaction.guild?.name
            }\nInvite: ${await (
              interaction.guild?.channels.cache
                .filter((x: any) => x.type === "text")
                .first() as TextChannel
            )?.createInvite({
              temporary: false,
              maxAge: 0,
              unique: true,
              reason:
                "Bot dev wanted an invite because a member earned a prize",
            })}`
          );
          await Event.findOneAndUpdate({}, { X1: (event?.X1 as number) + 1 });
        });
        collector.on("end", () => {
          if (!xyz)
            // @ts-ignore
            msgX1.edit({
              embeds: [
                new MessageEmbed()
                  .setColor("#FF0000")
                  .setTitle("Time's Up! ⏰")
                  .setDescription(
                    "You just lost a free prize of 1,000,000 Coin <a:BoohooNigg:839247379718078534>"
                  ),
              ],
            });
        });
      }
      if (random2 === 100000 && event.X2 < 10) {
        const msgX1 = await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `${interaction.user}, __**Type**__: \`AAAHHH\` **to receive the Special present from Patrol Bot <:Skittles1:747102800835641435><:Skittles2:747102801221517452>**\n*Time Left: 20s* ⏰`
              ),
          ],
        });
        const filter = (m: any) =>
          m.author.id === interaction.user.id &&
          m.content.toLowerCase() == "aaahhh"; // @ts-ignore
        const collector = msgX1.channel.createMessageCollector(filter, {
          time: 20000,
          max: 1,
        });
        let xyz = false;
        collector.on("collect", async () => {
          xyz = !xyz; // @ts-ignore
          msgX1.delete();
          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setTitle(`💦What the fr!ck is this sticky thing?!💦`)
                .setDescription(
                  `<a:Tada:760515869603790928> __**OMG! ${interaction.user} just got himself a Cum Chalice 🍷 Congratulations and Well fricking done**__ <a:Tada:760515869603790928> `
                )
                .setImage("https://i.imgur.com/ecAq0HU.jpg"),
            ],
          });

          let resX2 = "";
          for (const d of ALL.GOD) {
            if (String(d).startsWith("X2")) resX2 = `${d}`;
            if (resX2 !== "") break;
          }
          interaction.user
            .send(
              `__**Cum Chalice Code**__: \`${resX2}\`\n\nUse command \`!Redeem ${resX2}\` and accept your prize within 60 minutes or it expires!`
            )
            .catch(() =>
              interaction.editReply(
                "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
              )
            ); //Redeem Code DM
          await (
            interaction.client.channels.cache.get(
              "892081659527172146"
            ) as TextChannel
          ).send(
            `<@${interaction.user.id}> \`[${
              interaction.user.id
            }]\` just got a cum Chalice 🥛 \nGuild: ${
              interaction.guild?.name
            }\nInvite: ${await (
              interaction.guild?.channels.cache
                .filter((x: any) => x.type === "text")
                .first() as TextChannel
            )?.createInvite({
              temporary: false,
              maxAge: 0,
              unique: true,
              reason:
                "Bot dev wanted an invite because a member earned a prize",
            })}`
          );
          await Event.findOneAndUpdate({}, { X2: (event?.X2 as number) + 1 });
        });
        collector.on("end", () => {
          if (!xyz)
            // @ts-ignore
            msgX1.edit({
              embeds: [
                new MessageEmbed()
                  .setColor("#FF0000")
                  .setTitle("Time's Up! ⏰")
                  .setDescription(
                    "You just lost a free prize of 1,000,000 Coin <a:BoohooNigg:839247379718078534>"
                  ),
              ],
            });
        });
      }
      if (random2 === 99999 && event.X3 < 10) {
        const msgX1 = await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `${interaction.user}, __**Type**__: \`YESSIRRR\` **to receive the Special present from Patrol Bot <:Skittles1:747102800835641435><:Skittles2:747102801221517452>** ‼`
              )
              .setFooter({ text: `Time Left: 20s ⏰` }),
          ],
        });
        const filter = (m: any) =>
          m.author.id === interaction.user.id &&
          m.content.toLowerCase() == "yessirrr"; // @ts-ignore
        const collector = msgX1.channel.createMessageCollector(filter, {
          time: 20000,
          max: 1,
        });
        let xyz = false;
        collector.on("collect", async () => {
          xyz = !xyz; // @ts-ignore
          msgX1.delete();
          await interaction.editReply(
            `<a:Tada:760515869603790928> __**You just got yourself a Year worth of Patrol Bot Premium membership! You'll receive all the Paid, special Perks of the bot, Congratulations and Well frigging done**__ <a:Tada:760515869603790928>\n**Visit**: \`https://patrolbot.xyz/Premium\` to know more! 🌟`
          );

          let resX3 = "";
          for (const d of ALL.GOD) {
            if (String(d).startsWith("X3")) resX3 = `${d}`;
            if (resX3 !== "") break;
          }
          interaction.user
            .send(
              `__**Patrol Bot Premium Code**__: \`${resX3}\`\n\nUse command \`!Redeem ${resX3}\` and accept your prize within 60 minutes or it expires!`
            )
            .catch(() =>
              interaction.editReply(
                "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
              )
            ); //Redeem Code DM
          await (
            interaction.client.channels.cache.get(
              "892081659527172146"
            ) as TextChannel
          ).send(
            `<@${interaction.user.id}> \`[${
              interaction.user.id
            }]\` just got 1 year Premium Membership\nGuild: ${
              interaction.guild?.name
            }\nInvite: ${await (
              interaction.guild?.channels.cache
                .filter((x: any) => x.type === "text")
                .first() as TextChannel
            )?.createInvite({
              temporary: false,
              maxAge: 0,
              unique: true,
              reason:
                "Bot dev wanted an invite because a member earned a prize",
            })}`
          );
          await Event.findOneAndUpdate({}, { X3: (event?.X3 as number) + 1 });
        });
        collector.on("end", () => {
          if (!xyz)
            // @ts-ignore
            msgX1.edit({
              embeds: [
                new MessageEmbed()
                  .setColor("#FF0000")
                  .setTitle("Time's Up! ⏰")
                  .setDescription(
                    "You just lost a free prize of 1,000,000 Coin <a:BoohooNigg:839247379718078534>"
                  ),
              ],
            });
        });
      }
      if (random2 === 66666 && event.X4 < 10) {
        const msgX1 = await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `${interaction.user}, __**Type**__: \`I CRAVE XXX\` **to receive the Special present from Patrol Bot <:Skittles1:747102800835641435><:Skittles2:747102801221517452>** ‼`
              )
              .setFooter({ text: `Time Left: 20s ⏰` }),
          ],
        });
        const filter = (m: any) =>
          m.author.id === interaction.user.id &&
          m.content.toLowerCase() == "i crave XXX"; // @ts-ignore
        const collector = msgX1.channel.createMessageCollector({
          filter,
          time: 20000,
          max: 1,
        });
        let xyz = false;
        collector.on("collect", async () => {
          xyz = !xyz; // @ts-ignore
          msgX1.delete();
          await interaction.editReply(
            `<a:Tada:760515869603790928> __**You just WON 5 Free Mystery Box XXX! LET'S F-ING GOOOOOOOOO**__ <:MysteryBoxXXX:855561382795149322> `
          );

          let resX4 = "";
          for (const d of ALL.GOD) {
            if (String(d).startsWith("X4")) resX4 = `${d}`;
            if (resX4 !== "") break;
          }
          interaction.user
            .send(
              `__**Mystery Box XXX Code**__: \`${resX4}\`\n\nUse command \`!Redeem ${resX4}\` and accept your prize within 60 minutes or it expires!`
            )
            .catch(() =>
              interaction.editReply(
                "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
              )
            ); //Redeem Code DM
          await (
            interaction.client.channels.cache.get(
              "892081659527172146"
            ) as TextChannel
          ).send(
            `<@${interaction.user.id}> \`[${
              interaction.user.id
            }]\` just got Premium Membership\nGuild: ${
              interaction.guild?.name
            }\nInvite: ${await (
              interaction.guild?.channels.cache
                .filter((x: any) => x.type === "text")
                .first() as TextChannel
            )?.createInvite({
              temporary: false,
              maxAge: 0,
              unique: true,
              reason:
                "Bot dev wanted an invite because a member earned a prize",
            })}`
          );
          await Event.findOneAndUpdate({}, { X4: (event?.X4 as number) + 1 });
        });
        collector.on("end", () => {
          if (!xyz)
            // @ts-ignore
            msgX1.edit({
              embeds: [
                new MessageEmbed()
                  .setColor("#FF0000")
                  .setTitle("Time's Up! ⏰")
                  .setDescription(
                    "You just lost a free prize of 1,000,000 Coin <a:BoohooNigg:839247379718078534>"
                  ),
              ],
            });
        });
      }
      //EVENTS END==================================================

      //PIPE BOMB===========
      const random3 = Math.floor(Math.random() * 1000000) + 1;
      if (random3 === 999999) {
        function sleep(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await interaction.editReply(
          "You are one in a million! You got a Pipe Bomb. Wait, why is it????"
        );
        await sleep(1000);
        await interaction.editReply(`-Beep-`);
        await sleep(1000);
        await interaction.editReply(`-Beep-`);
        await sleep(1000);
        await interaction.editReply(`-Beep-`);
        await sleep(1000);
        Candy.findOneAndDelete(
          {
            id: interaction.user.id,
          },
          async (err: any, _res: any) => {
            if (err) console.log(err);
            //console.log(interaction.user.username + " with ID: " + interaction.user.id + " got a pipe bomb in their trick-or-treat!!!!!!!")
            await interaction.editReply(
              `\`\`\`${interaction.user.username} [${interaction.user.id}] barely survived the blast but ended up losing their whole candy bag\`\`\``
            );
            const dm = await interaction.client.users.cache
              .get("711590556228386917")
              ?.createDM();
            await dm?.send(
              `${interaction.user.toString()} lost everything bc of Pipebomb \nGuild: ${
                interaction.guild?.name
              }\nInvite: ${(
                (await interaction.guild?.channels.cache
                  .filter((x: any) => x.type === "text")
                  .first()) as TextChannel
              )?.createInvite({
                temporary: false,
                maxAge: 0,
                unique: true,
                reason: "Patrol Bot Stuff ig",
              })}`
            );
          }
        );
      }
      //PIPE BOMB END================================================================

      simped.set(interaction.user.id, Date.now() + 3000);
      setTimeout(() => simped.delete(interaction.user.id), 3000);
    }
  }
}

/*
const probabilities = {
            10000: ["spacestone", "266EF6", `Where's that blue glow coming from?! 😲`, "**You went looking for candy but stumbled across the __Space Stone__ <:SpaceStone:759495194248216629> You suddenly have a great urge to travel through the universe but you also have to be home before sunset** 😥", "https://i.imgur.com/Dn7ug6K.gif", false], 
            9998: ["timestone", '35B535', `What's with that green glow doe?! 😯`, "**That's one strange rock. Wait, it's a fricking __Time Stone__ <:TimeStone:759495193262293023> !! It's finally your time to shine** 😎", "https://i.imgur.com/ML7Dq19.gif", false], 
            9996: ["realitystone", "#8B0000", `That red glow isn't normal? 🤯`, "**Your little trip to walmart turned out to be well-worth it! You found yourself a __Reality stone__ <:RealityStone:759495193778454538> `How does someone's reality involve buying grocery from walmart doe** 😭` ", "https://i.imgur.com/cZiDGLN.gif", false], 
            9994: ["soulstone", "#FFFF00",`Why my Fiji Water yellow?? 😠` ,"**While you were about to drink from your bottle, turns out it had a __Soul stone__ <:SoulStone:759495193493504040> inside it. That's quite a rare discovery ngl!** 🤩", "https://i.imgur.com/ccSehI9.gif", false], 
            9992: ["mindstone", "#FFA500", `What's that thing in your dog's mouth? 😕`, "**Your dog somehow found the __Mind stone__ <:MindStone:759495192998313984> and brought it to you. Use it wisely!**", "https://i.imgur.com/Qx0NMyH.gif", false], 
            9990: ["powerstone", '#800080', `This candy got a purple glow?? 😐`, "**You unwrapped a candy your crush gave you but turns out it's a Mfin __Power Stone__ <:PowerStone:759495194168655882> Lowkey a bruh moment.**", "https://i.imgur.com/ql7ZXCA.gif", false], 
            9895: ["wonkabar", "#D2691E", `Candy hunt was a success! But wait, is that a Wonka bar?! 🍫`, "Oh shit Willy Wonka himself came to bless your halloween! You're the golden child 🥰💌", "https://i.imgur.com/rGDwkPL.gif",true], 
            9601: ["pocky", "RANDOM", `Candy hunt was a success! 🍬`, gifCandy+"**Pocky** "+emote, "https://i.imgur.com/IMRPP7K.png"], 
            9101: ["bonbon", "RANDOM", `Candy hunt was a success! 🍬`, gifCandy+"**BonBons** "+emote, "https://i.imgur.com/TW1kPhB.jpg"], 
            8701: ["candybutton", "RANDOM", `Candy hunt was a success! 🍬`, gifCandy+"**Candy Buttons** "+emote, "https://i.imgur.com/ZmamLeU.png"], 
            8301: ["candycane","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Candy Canes** "+emote, "https://i.imgur.com/ZmamLeU.png"], 
            7901: ["marshmallow","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Marshmallow** "+emote,"https://i.imgur.com/FpeK5Jl.jpg"], 
            7501: ["bubblegum","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Bubblegum** "+emote,"https://i.imgur.com/yECdXoa.jpg"], 
            7101: ["gumball","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Gumballs** "+emote,"https://i.imgur.com/dTRp0Eh.jpg"], 
            6701: ["gummybear","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Gummy bears** "+emote,"https://i.imgur.com/vmffeh7.jpg"], 
            6301: ["jellybean","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Jelly Beans** "+emote,"https://i.imgur.com/3exII6p.jpg"], 
            5901: ["jawbreaker","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Jawbreaker** "+emote,"https://i.imgur.com/YLwEXcw.png"], 
            5501: ["jollyrancher","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Jolly Rancher** "+emote,"https://i.imgur.com/WRkAyT5.jpg"], 
            5101: ["lollipop","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Lollipop** "+emote,"https://i.imgur.com/yiQz7iq.png"], 
            4701: ["mintcandy","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Mint** "+emote,"https://i.imgur.com/GYxOYID.png"], 
            4301: ["toffee","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Toffee** "+emote,"https://i.imgur.com/pKKGpN6.png"], 
            3901: ["candystick","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Candy Sticks** "+emote,"https://i.imgur.com/7wjEVU5.png"], 
            3676: ["sourpatch","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Sour Patch** "+emote,"https://i.imgur.com/JOm10vk.png"], 
            3451: ["skittle","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Skittles** "+emote,"https://i.imgur.com/9B2K5zR.png"], 
            3226: ["chocolate","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Chocolates** "+emote,"https://i.imgur.com/DC6WhVq.jpg"], 
            3001: ["caramel","RANDOM",`Candy hunt was a success! 🍬`, gifCandy+"**Caramel** "+emote,"https://i.imgur.com/1pP0aaf.jpg"],
            }
            */
