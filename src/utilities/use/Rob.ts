import { CommandInteraction, MessageEmbed } from "discord.js";
import { Collection } from "discord.js";
import { UsableItem } from ".";

import findByUserId from "../../database/functions/economy/findUserById";
import findOneOrCreate from "../../database/functions/findOneOrCreate";
import { Economy, IEconomy } from "../../database/models/EconomyModel";
import { GuildModel } from "../../database/models/GuildModel";
import { IItemUse, ItemUseModel } from "../../database/models/ItemUseModel";
import { PetModel } from "../../database/models/PetModel";
import { User } from "../../database/models/UserModel";
import { addItemToUser } from "../query/inventory";
import { doWeeklyMission } from "../query/missions";

import emoji from "../../constants/emoji";
import { IItem } from "../../types/Item";
import sendError from "../sendError";

const lockLevels: Record<string, number> = {
  "ironlock": 3,
  "goldlock": 25,
  "titaniumlock": 50
}
const lock = {
  supportsQuantity: true,
  waitForSuccess: true,
  async use(interaction: CommandInteraction, _economy: IEconomy, item: IItem, quantity: number) {
    const [userInfo, itemUseInfo] = await Promise.all([
      findOneOrCreate({ _id: interaction.user.id }, { _id: interaction.user.id }, User),
      findOneOrCreate({ id: interaction.user.id }, { id: interaction.user.id }, ItemUseModel)
    ]);

    const level = lockLevels[item.name2];
    if(!userInfo.premium && itemUseInfo.protects + (level * quantity) > 50) {
      sendError(interaction, "You cannot have more than **50** active protections at the same time!");
      return false;
    } else if(itemUseInfo.protects + (level * quantity) > 150) {
      sendError(interaction, "You cannot have more than **150** active protections at the same time! \n*(Premium Perks Acknowledged)*")
      return false;
    }

    await ItemUseModel.updateOne({ id: interaction.user.id }, { $inc: { protects: level * quantity } });
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`Installed ${item.name} 🔒`)
          .setColor("GREEN")
          .setThumbnail("https://i.imgur.com/ZhonHC1.gif")
          .setDescription(
            `${item.icon} ${interaction.user} added \`x${quantity * level}\` protections to their wallet.\n\n➜ ᴛᴏᴛᴀʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴꜱ: **\`${itemUseInfo.protects + (quantity * level)}\`** 🛡️`
          ),
      ],
    });
    return true;
  },
};

const key = {
  supportsQuantity: true,
  waitForSuccess: true,
  async use(interaction: CommandInteraction, _economy: IEconomy, item: IItem, quantity: number) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("Tag the person you want to use the Key on 🔑")
          .setDescription(
            "`This window will close in 30 seconds` <a:timer:838498902067380280>"
          ),
      ],
    });

    const response = await interaction.channel
      ?.awaitMessages({
        filter: (msg) => {
          if (msg.author.id !== interaction.user.id) return false;
          const m = msg.mentions.users?.first();
          if (!m || m.id === interaction.user.id || m.bot) return false;
          else return true;
        },
        max: 1,
        time: 30000,
        errors: ["time"],
      })
      .then((res) => res.first())
      .catch(() => {
        interaction.followUp(
          "You didn't even mention anyone! Try again next time."
        );
        return null;
      });

    if (!response) return false;
    const mentioned = response.mentions.members!.first()!;

    const targetInfo = await ItemUseModel.findOne({ id: mentioned.id });
    if (!targetInfo || (targetInfo?.protects ?? 0 < 1)) {
      interaction.followUp(
        "What? Try using a key on someone who actually has protection next time."
      );
      return false;
    }

    const float = Math.random();
    if (float < 0.25) {
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setTitle("❌ Keys broke 🔑")
            .setColor("#FF0000")
            .setThumbnail("https://i.imgur.com/4AvAdLa.gif")
            .setDescription(
              `${interaction.user}'s \`x${quantity}\` **${item.icon} ${item.name}** failed to work on ${mentioned} 😭`
            ),
        ],
      });
      return true;
    } else {
      const level = lockLevels[item.name2];
      await ItemUseModel.updateOne({ id: mentioned.id }, { $inc: { protects: -(quantity * level) } });
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setTitle(`Used ${item.name} 🔑`)
            .setColor("RANDOM")
            .setThumbnail("https://i.imgur.com/xUa9Cr3.gif")
            .setDescription(
              `<:TitaniumKey:887021840940290089> ${interaction.user} Reduced \`x${quantity * level}\` protections from ${mentioned}'s' Wallet.\n\n➜ ᴛᴏᴛᴀʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴꜱ ʟᴇꜰᴛ: **\`${targetInfo.protects - (quantity * level)}\`** 🛡️`
            ),
        ],
      });
      return true;
    }
  },
};

const crystalmeth = {
  supportsQuantity: true,
  async use(interaction: CommandInteraction, economy: IEconomy, item: IItem, quantity: number) {
    const shards = quantity * 10;
    await addItemToUser(interaction.user.id, "Shards", shards, economy);
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("AQUA")
          .setThumbnail("https://i.imgur.com/TgxqFgP.gif")
          .setTitle("Process complete ⚗")
          .setDescription(
            `<a:GreenTick:736282149094949096> | ${interaction.user} crushed \`x${quantity}\` ${item.icon} **${item.name}** -->  \`x${shards}\` <:CrystalMethShards:856618799712829482> Shards `
          ),
      ],
    }); 
  }
}

const shards = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction) {
    // Check rob status
    const guildData = await GuildModel.findOne({ _id: interaction.user.id }).lean();
    if(guildData && guildData.commands.find((c) => c.name.toLowerCase() === "rob")?.disabled === true) {
      sendError(interaction, "Robbing is disabled in this server!");
      return false;
    }

    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("Tag the person you want to rob!")
          .setDescription("You started smoking the shards <:CrystalMethShards:856618799712829482>⚗️\n\n`Under the influence of Methamphetamine, your `__`chances of robbing increase to 99.9%`__ <a:robbery:775808009825157178>")
      ],
    });

    const response = await interaction.channel
      ?.awaitMessages({
        filter: (msg) => {
          if (msg.author.id !== interaction.user.id) return false;
          const m = msg.mentions.users?.first();
          if (!m || m.id === interaction.user.id || m.bot) return false;
          else return true;
        },
        max: 1,
        time: 30000,
        errors: ["time"],
      })
      .then((res) => res.first())
      .catch(() => {
        interaction.followUp(
          "You didn't even mention anyone! Try again next time."
        );
        return null;
      });

    if (!response || !response.mentions.members) return false;
    const mentioned = response.mentions.members.first();
    if (!mentioned) return false;

    const targetEconomy = await findByUserId(mentioned.id);
    if (!targetEconomy || targetEconomy?.coins < 1) {
      interaction.followUp(
        "That's a nobody. Next time rob someone who atleast had something!"
      )
      return false;
    }

    const targetSelectedPet = await PetModel.findOne({ id: mentioned.id, current: true }).lean();
    if(targetSelectedPet && targetSelectedPet.UID === 9) {
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor("#FF0000")
            .setThumbnail(
              "https://cdn.discordapp.com/emojis/" +
                targetSelectedPet["sprite"].split(":")[2].replace(">", "") +
                ".gif"
            )
            .setTitle("Skill In-use: BODYGUARD 💪")
            .setDescription(
              `${mentioned}***'s ${targetSelectedPet["name"]}*** *posed Physical Threat to the point you decided to give up robbing them...* <:WhatThe:738742356739883048>`
            ),
        ],
      });
      return true;
    }

    let stealMultiplier = Math.random() > 0.85 ? 0.05 : Math.random() < 0.333 ? 0.1 : Math.random() < 0.125 ? 0.2 : Math.random() > 0.97 ? 0.5 : 0.2;
    stealMultiplier += (Math.random()/60);
    const stolen = Math.floor(targetEconomy.coins * stealMultiplier);
    await Promise.all([
      Economy.updateOne({ id: interaction.user.id }, { $inc: { coins: stolen } }),
      Economy.updateOne({ id: mentioned.id }, { $inc: { coins: -stolen } }),
    ]);
    interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setColor("#00FF00")
          .setThumbnail("https://i.imgur.com/f1dQ7O1.gif")
          .setAuthor({
            name: "Money Stolen ☑",
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(
            `Successfully robbed ${mentioned} of ${emoji.coins} **${stolen}**! <a:robbery:775808009825157178>`
          ),
      ],
    });
    return true;
  },
};

const snitch = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction) {
    const itemUses = await findOneOrCreate({ id: interaction.user.id }, { id: interaction.user.id }, ItemUseModel) as IItemUse;
    if(itemUses.snitch) {
      sendError(interaction, "You already have a snitch looking out for you <:EricaEvilPlotting:897841584647847986>");
      return false;
    }

    await ItemUseModel.updateOne({ id: interaction.user.id }, { $set: { snitch: true } });

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Snitch Activated ✅")
          .setColor("RANDOM")
          .setThumbnail("https://i.imgur.com/Gj8TRpO.gif")
          .setDescription(
            `<:Snitch:856582087049740348> ${interaction.user} successfully hired a snitch to look after their wallet!`
          ),
      ],
    });
    return true;
  }
}

const snitchdemon = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction) {
    const [itemUses, userInfo] = await Promise.all([
      findOneOrCreate({ id: interaction.user.id }, { id: interaction.user.id }, ItemUseModel),
      findOneOrCreate({ _id: interaction.user.id }, { _id: interaction.user.id }, User)
    ]);

    if(itemUses.snitchdemon) {
      sendError(interaction, "You already have a **snitch demon** looking out for you <:EricaEvilPlotting:897841584647847986>");
      return false;
    }

    if(!userInfo.premium) {
      sendError(interaction, "This is a premium only item!");
      return false;
    }

    await ItemUseModel.updateOne({ id: interaction.user.id }, { $set: { snitchDemon: true } });
    
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Snitching Demon Activated ✅✅")
          .setColor("RANDOM")
          .setThumbnail("https://i.imgur.com/Gj8TRpO.gif")
          .setDescription(
            `<:SnitchDemon:856615583922389003> ${interaction.user} was able to summoned a extremely powerful Snitch to look after their money!`
          ),
      ],
    });		

    return true;	
  }
}


const handcuffs = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction) {
    await findOneOrCreate({ id: interaction.user.id }, { id: interaction.user.id }, ItemUseModel);
    
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("🚔 Tag the person you want to use handcuffs on")
          .setDescription(
            "`This window will close in 30 seconds` <a:timer:838498902067380280>"
          ),
      ],
    });

    const response = await interaction.channel
      ?.awaitMessages({
        filter: (msg) => {
          if (msg.author.id !== interaction.user.id) return false;
          const m = msg.mentions.users?.first();
          if (!m || m.id === interaction.user.id || m.bot) return false;
          else return true;
        },
        max: 1,
        time: 30000,
        errors: ["time"],
      })
      .then((res) => res.first())
      .catch(() => {
        interaction.followUp(
          "You didn't even mention anyone! Try again next time."
        );
        return null;
      });

    if (!response || !response.mentions.members) return false;
    const mentioned = response.mentions.members.first();
    if(!mentioned) return false;

    await Promise.all([
      ItemUseModel.updateOne({ id: interaction.user.id }, {
        handcuffs: mentioned.id,
        handcuffsTime: Date.now() + 21600000
      }),
      doWeeklyMission(interaction.user.id, "use_Handcuffs")
    ]);

    interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setTitle("Handcuffs Activated ✅")
          .setColor("RANDOM")
          .setThumbnail("https://i.imgur.com/p0Uvqcj.gif")
          .setDescription(
            `<a:GreenTick:736282149094949096> | ${mentioned} will not be able to rob ${interaction.user} for a random period of time <:Handcuffs:855521328748953610>\nLet's see how long until he's set free 🙊`
          ),
      ],
    });

    return true;
  },
};

export function register(collection: Collection<string, UsableItem>) {
  collection.set("ironlock", lock);
  collection.set("goldlock", lock);
  collection.set("titaniumlock", lock);

  collection.set("ironkey", key);
  collection.set("goldkey", key);
  collection.set("titaniumkey", key);

  collection.set("crystalmeth", crystalmeth);
  collection.set("shards", shards);

  collection.set("snitch", snitch);
  collection.set("snitchdemon", snitchdemon);

  collection.set("handcuffs", handcuffs);
}
