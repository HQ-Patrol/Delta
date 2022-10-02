import { CommandInteraction, MessageEmbed } from "discord.js";
import { Collection } from "discord.js";
import dot from "dot-object";
import { UsableItem } from ".";

import { IItem } from "../../types/Item";
import sendError from "../sendError";

import { IEconomy } from "../../database/models/EconomyModel";
import { HalloweenModel } from "../../database/models/HalloweenModel";
import { rnd, rndInArray } from "../global";
const candybundle = {
  supportsQuantity: true,
  waitForSuccess: true,
  async use(
    interaction: CommandInteraction,
    _economy: IEconomy,
    _item: IItem,
    quantity: number
  ) {
    const player = await HalloweenModel.findOne({
      id: interaction.user.id,
    }).lean();
    if (!player) {
      sendError(
        interaction,
        `${interaction.user} hasn't started their Candy Pilgrimage yet! Type: /trickortreat to get started on your journey! <:Skittles1:747102800835641435><:Skittles2:747102801221517452>`
      );
      return false;
    }

    // what the fuck
    const candies = 50 * quantity;
    const added: Record<string, number> = {};
    const filtered = Object.keys(player.candy).filter(
      (x) => !x.endsWith("stone") && !x.startsWith("$")
    );
    let candiestaken = 0;
    while (candiestaken < 45 * quantity) {
      const randomcandy = rndInArray(filtered) as string;
      const taken =
        Math.floor(Math.random() * (45 * quantity - candiestaken)) + 1;
      added[randomcandy] = (added[randomcandy] ?? 0) + taken;
      candiestaken += taken;
    }
    added["wonkabar"] = 5 * quantity;

    let stone, img, icon, quan;
    if (quantity <= 4) quan = 1;
    else if (quantity <= 9) quan = 2;
    else if (quantity <= 15) quan = 3;
    else quan = 4;

    const random = rnd(0, 20);
    switch (random) {
      case 1:
        stone = "mindstone";
        img = "https://i.imgur.com/Qx0NMyH.gif";
        icon = "<:MindStone:759495192998313984>";
        break;
      case 2:
        stone = "powerstone";
        img = "https://i.imgur.com/ql7ZXCA.gif";
        icon = "<:PowerStone:759495194168655882>";
        break;
      case 3:
        stone = "spacestone";
        img = "https://i.imgur.com/Dn7ug6K.gif";
        icon = "<:SpaceStone:759495194248216629>";
        break;
      case 4:
        stone = "timestone";
        img = "https://i.imgur.com/ML7Dq19.gif";
        icon = "<:TimeStone:759495193262293023>";
        break;
      case 5:
        stone = "soulstone";
        img = "https://i.imgur.com/ccSehI9.gif";
        icon = "<:SoulStone:759495193493504040>";
        break;
      case 6:
        stone = "realitystone";
        img = "https://i.imgur.com/cZiDGLN.gif";
        icon = "<:RealityStone:759495193778454538>";
        break;
    }
    if (stone) added[stone] = 1;

    await HalloweenModel.updateOne(
      { id: interaction.user.id },
      {
        $inc: {
          CandyCount: candies,
          ...dot.dot({ candy: added })
        },
      }
    );

    const stolenmessage = Object.entries(added).filter((x) => x[0] !== "wonkabar" && !x[0].endsWith("stone")).map(x => `‣ \`${x[0].toUpperCase()}\`` + " - " + `\`${x[1]}\``).join('\n');
    let additional;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setFooter({ text: `➛ Visit: patrolbot.xyz/Store for more 🎁💰` })
      .setThumbnail("https://i.imgur.com/K2W2O6F.gif")
      .setAuthor({
        name: `Opened x${quantity} Candy Bundle! 🍬🎁`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    if (stone && img && icon) {
      embed.setImage(img);
      additional = `\n<a:Right:763251259896758282> ᴡᴀɪᴛ, ꜱᴏᴍᴇᴛʜɪɴɢ'ꜱ ɢʟᴏᴡɪɴɢ ɪɴ ᴛʜᴇ ʙᴏx⁉\n+ \`x${quan}\` **${stone.toUpperCase()}** ${icon}`;
    }

    embed.setDescription(
      "**Oh schnappers! <:PepePogsExcite:727202133291565119> You received**:\n\n" +
        stolenmessage + `\n\n<a:Right:763251259896758282> +ɢᴜᴀʀᴀɴᴛᴇᴇᴅ ᴀᴅᴅɪᴛɪᴏɴᴀʟ \`x${added["wonkabar"]}\` **ᴡᴏɴᴋᴀ ʙᴀʀꜱ** 🍫` + (additional ?? "")
    );

    interaction.reply({
      embeds: [embed],
    });
    return true;
  },
};

export function register(collection: Collection<string, UsableItem>) {
  collection.set("candybundle", candybundle);
}
