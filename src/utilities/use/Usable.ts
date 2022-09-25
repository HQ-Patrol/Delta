import { Collection, CommandInteraction, MessageEmbed } from "discord.js";
import { UsableItem } from ".";
import emoji from "../../constants/emoji";
import findOneOrCreate from "../../database/functions/findOneOrCreate";
import { Economy, IEconomy } from "../../database/models/EconomyModel";
import { IItemUse, ItemUseModel } from "../../database/models/ItemUseModel";
import { IItem } from "../../types/Item";
import { rnd, rndInArray } from "../global";
import { findItem } from "../query/item";
import { doMonthlyMission, doWeeklyMission } from "../query/missions";
import sendError from "../sendError";

const coinbag = {
	supportsQuantity: true,
	async use(interaction: CommandInteraction, _economy: IEconomy, item: IItem, quantity: number) {
		let earn = 0, description = "An error happened";

    switch(item.name) {
      case "Coin Bag": 
        earn = (Math.floor(Math.random() * (700 - 200 + 1)) + 200) * quantity;
        description = `${interaction.user} searched through \`x${quantity}\` ${item.icon} **${item.name}(s)** to find ${emoji.coins} **${earn}**`;
        break;
      case "Coin Bag X": 
        earn = (Math.floor(Math.random() * (5000 - 1250 + 1)) + 1250) * quantity;
        description = `${interaction.user} untied \`x${quantity}\` ${item.icon} **${item.name}(s)** to find an astounding ${emoji.coins} **${earn}**`;
        break;
      case "Coin Bag XXX": 
        earn = (Math.floor(Math.random() * (250000 - 100000 + 1)) + 100000) * quantity;
        description = `:tada: ${interaction.user} untied \`x${quantity}\` ${item.icon} **${item.name}(s)** to find an astounding ${emoji.coins} **${earn}**`;
        break;
    }

		await Economy.updateOne({ id: interaction.user.id }, { lastUse: Date.now(), $inc: { coins: earn } });
		return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#FFD700")
          .setDescription(description),
      ],
    });
	}
}

// item probs
// common 50%
// uncommon 25%
// rare 15%
// veryrare 9.77%
// superrare 0.2299998%
// impossible 0.0000002%
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mbconfig: any = {
	"mb1": {
		weekly: "use_MysteryBox1",
		monthly: "use_MysteryBox1",
		thumbnail: "https://i.imgur.com/kBgaRJm.gif",
    rnd: {
      coins: [75, 250],
      xp: [5, 25],
    },
    items: {
      common: ["banana", "cookie", "snowball"],
      uncommon: "coin bag",
      rare: ["iron lock", "iron key"],
      veryrare: "xp blast",
      superrare: "premium 7d",
      impossible: "random dragon ball"
    }
	},
	"mb2": {
		monthly: "use_MysteryBox2",
		thumbnail: "https://i.imgur.com/E9JQ8Sf.gif",
    rnd: {
      coins: [500, 1000],
      xp: [25, 100],
    },
    items: {
      common: ["snowball", "snitch", "iron lock", "coin bag", "iron lock", "coin bag", "iron key", "iron key"],
      uncommon: ["coin bag x", "prayer rug", "handcuffs", "soft boiled egg"],
      rare: ["gold lock", "gold key"],
      veryrare: "xp blast",
      superrare: "random dragon ball",
      impossible: "premium 1m"
    }
	},
	"mb3": {
		thumbnail: "https://i.imgur.com/fPoOs4W.gif",
    rnd: {
      coins: [2500, 5000],
      xp: [100, 180],
    },
    items: {
      common: ["prayer rug", "handcuffs", "coin bag x", "soft boiled egg", "iron key"],
      uncommon: ["soft boiled egg", "gold lock", "snitch demon", "gold key"],
      rare: "xp blast",
      veryrare: ["crystal meth", "titanium lock", "premium 7d", "titanium key", "weekly skip", "crystal meth", "titanium lock", "premium 7d", "titanium key", "weekly skip", "growth vial", "pet food", "love potion", "pet food", "love potion"],
      superrare: "random dragon ball",
      impossible: "discord nitro"
    }
	},
	"mbxxx": {
		monthly: "use_MysteryBoxXXX",
    rnd: {
      coins: [15000, 50000],
      xp: [250, 500],
    },
		thumbnail: "https://i.imgur.com/2skWSvP.gif",
    items: {
      common: ["crystal meth", "titanium lock", "monthly skip", "titanium key", "growth vial"],
      uncommon: ["medium boiled egg", "premium 1m", "coin bag xxx"],
      rare: "xp blast",
      veryrare: "random dragon ball",
      superrare: ["cum chalice", "hero of soviet union", "hard boiled egg", "gambling club card", "growth vial"],
      impossible: "discord nitro"
    }
	},
  "mbxxl": {
    thumbnail: "https://i.imgur.com/FIDILkp.gif",
    rnd: {
      coins: [80000, 150000],
      xp: [400, 1500],
    },
    items: {
      common: ["crystal meth", "titanium lock", "monthly skip", "coin bag xxx", "titanium key", "growth vial"],
      uncommon: ["mystery box xxx", "premium 1m", "hard boiled egg", "growth vial"],
      rare: "random dragon ball",
      veryrare: ["coin bag xxx", "hard boiled egg", "gambling club card", "mystery box xxx", "growth vial"],
      superrare: "xp blast",
      impossible: "mystery box xl"
    }
  }
};
const mysterybox = {
  supportsQuantity: true,
  async use(interaction: CommandInteraction, economy: IEconomy, item: IItem, quantity: number) { 
    // Limit quantity
		if(quantity > 25) return sendError(interaction, "You may not open more than 25 boxes at once!");

    const config = mbconfig[item.alias];

    const allItems: Record<string, number> = {};
    const inventory = economy.items;
    let totalXP = 0, totalCoins = 0;
    
    for(let i = 0; i < quantity; i++) {
      totalCoins += rnd(config.rnd.coins[0], config.rnd.coins[1]);
      totalXP += rnd(config.rnd.xp[0], config.rnd.xp[1]);

      let float = Math.random();
      let item: string, quantity = 1;
      if(0.50 >= float) item = rndInArray(config.items.common) as string;
      else if(0.75 >= float) item = rndInArray(config.items.uncommon) as string;
      else if(0.90 >= float) item = rndInArray(config.items.rare) as string;
      else if(0.9877 >= float) item = rndInArray(config.items.veryrare) as string;
      else if(0.999999998 >= float) item = rndInArray(config.items.superrare) as string;
      else item = rndInArray(config.items.impossible) as string;
    
      if(0.50 < float && item !== "random dragon ball") {
        float = Math.random();
        if(float < 0.80) quantity = 1;
        else if(float < 0.95) quantity = 2;
        else quantity = 3;
      }

      if(item === "xp blast") {
        totalXP += rnd(config.rnd.xp[0] + 1000, config.rnd.xp[1] + 5000);
      } else if(item === "random dragon ball") {
        item = `dragon ball ${rnd(1, 7)}`;
      }

      if(allItems[item]) allItems[item] += quantity;
      else allItems[item] = quantity;
    }

    let description = `:tada: ${interaction.user} opened \`x${quantity}\` ${item.icon} **${item.name}** to find:`;
    for(const item in allItems) {
      const itemFind = findItem(item);
      if(!itemFind) continue;
      description += `\n➛ \`x${allItems[item]}\` ${itemFind.icon} **${itemFind.name}**`;

      // add in inventory
      const invFind = inventory.find(i => i.name == itemFind.name);
      if(invFind) {
        invFind.count += allItems[item];
      } else {
        inventory.push({
          name: itemFind.name,
          count: allItems[item],
          icon: itemFind.icon,
          type: itemFind.type,
          data: itemFind.data,
        })
      }
    }
    description += `\n➛ \`+${totalCoins}\`${emoji.coins}\n➛ \`+${totalXP}\` ✨`;

    const query = {
      $inc: {
        xp: totalXP,
        coins: totalCoins
      },
      $set: {
        items: inventory
      }
    };

    await Economy.updateOne({ id: interaction.user.id }, query);
    if(config.weekly) {
      await doWeeklyMission(interaction.user.id, config.weekly, quantity);
    }
    if(config.monthly) {
      await doMonthlyMission(interaction.user.id, config.monthly, quantity);
    }

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${quantity}x ${item.name} Opened ✅🎁`)
					.setColor("RANDOM")
          .setThumbnail(config.thumbnail)
          .setDescription(description)
      ]
    })
  }
}

const prayerrug = {
  supportsQuantity: true,
  async use(interaction: CommandInteraction, _economy: IEconomy, _item: IItem, quantity: number) {
    const itemUses = await findOneOrCreate({ id: interaction.user.id }, { id: interaction.user.id }, ItemUseModel) as IItemUse;

    if(itemUses.rugTime && itemUses.rugTime > Date.now()) return sendError(interaction, "You are already praying on a rug right now! <a:RugPray:857369869762822144>");

    await Promise.all([
      ItemUseModel.updateOne({ id: interaction.user.id }, { $set: { rugTime: Date.now() + (3_600_000 * quantity) } }),
      doWeeklyMission(interaction.user.id, "use_PrayerRug", quantity)
    ]);

    return interaction.reply({ embeds: [
      new MessageEmbed()
        .setDescription(`<:PrayerRug:855847171140091984> | ${interaction.user} **started praying on the rug for the next __${60 * quantity} minutes__** 🌙\n\`˃ Praying gains are increased\` 🧘‍♀️`)
        .setColor("RANDOM")
        .setThumbnail("https://i.imgur.com/js2d9E4.gif")] 
    });
  }
}

export function register(collection: Collection<string, UsableItem>) {
	collection.set("coinbag", coinbag);
  collection.set("coinbagx", coinbag);
  collection.set("coinbagxxx", coinbag);

  collection.set("mysterybox1", mysterybox);
  collection.set("mysterybox2", mysterybox);
  collection.set("mysterybox3", mysterybox);
  collection.set("mysteryboxxxx", mysterybox);
  // TODO: mbxl

  collection.set("prayerrug", prayerrug);

  
}