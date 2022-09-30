import { ButtonInteraction, ColorResolvable, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Collection } from "discord.js";
import { UsableItem } from ".";

import { IItem } from "../../types/Item";
import { IPetResolved } from "../../types/Pet";

import sendError from "../sendError";
import { giveBadge } from "../badges";
import { capitalize, footer, rnd } from "../global";

import { Economy, IEconomy } from "../../database/models/EconomyModel";
import { IPet, PetModel } from "../../database/models/PetModel";
import { User } from "../../database/models/UserModel";
import findOneOrCreate from "../../database/functions/findOneOrCreate";

import { changePetName, getColorByRarity, resolvePet } from "../query/pets";
import { addItemToUser } from "../query/inventory";
import { doMonthlyMissions, doWeeklyMissions } from "../query/missions";

function generateSkills(total: number, max: number) {
  // shitty function made by yours truly to generate a random array
  // that contains sums to "total" 

  let temptotal = total;
  // start off with an array all filled with 1
  const array: number[] = new Array(max).fill(1);
  temptotal -= max;
  array.forEach((_, i) => {
    const rnd = Math.trunc(Math.random() * (temptotal / 2));
    array[i] += rnd;
    temptotal -= rnd;
  });
  if (temptotal !== 0) array[2] += temptotal;
  return array;
}

async function displayPet(interaction: CommandInteraction, pet: IPetResolved, petDocument: IPet, shadow: boolean, desc: string) {
  const hatchedEmbed = new MessageEmbed()
    .setAuthor({
      name: `${interaction.user.username} Successfully hatched a Pet ☑️`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setColor(getColorByRarity(pet["rarity"]) as ColorResolvable)
    .addFields(
      {
        name: "__Name__",
        value: `**${pet.name}**`,
        inline: true,
      },
      {
        name: "__Species__",
        value: `**${capitalize(pet.species)}** ${
          shadow ? pet?.shadowSprite : pet.sprite
        }`,
        inline: true,
      },
      {
        name: "__Rarity__",
        value: `\`${pet.rarity}\``,
        inline: true,
      },
      {
        name: "【 __Pet Attributes__ 】",
        value: desc,
      }
    )
    .setThumbnail(
      "https://cdn.discordapp.com/emojis/" +
        (shadow ? pet.shadowSprite : pet.sprite)
          .split(":")[2]
          .replace(">", "") +
        ".gif"
    )
    .setFooter({
      text: shadow
        ? "⫸ 𝐘𝐨𝐮 𝐡𝐚𝐭𝐜𝐡𝐞𝐝 𝐚 𝐒𝐡𝐚𝐝𝐨𝐰 𝐕𝐚𝐫𝐢𝐚𝐧𝐭 𝐰𝐢𝐭𝐡 𝐎𝐝𝐝𝐬: 𝟎.𝟎𝟎𝟎𝟎𝟒% 🔮"
        : `￫ ${footer()}`,
    });
  
  interaction.editReply({
    content: null,
    embeds: [hatchedEmbed],
    components: [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("name")
          .setLabel("Name")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("disown")
          .setLabel("Disown")
          .setStyle("DANGER")
      ),
    ],
  });

  const message = await interaction.fetchReply() as Message;
  const filter = (int: ButtonInteraction) =>
    ["disown", "name"].includes(int.customId) &&
    int.user.id === interaction.user.id;
  const disown = await message
    .awaitMessageComponent({
      filter,
      componentType: "BUTTON",
      time: 20000,
    })
    .then(async (int: ButtonInteraction) => {
      if (int.customId === "disown") {
        await int.deferUpdate();
        // User has disowned the pet:
        message.edit({
          content: `You **DISOWNED** **\`the ${capitalize(pet.species)}\`**! <:RestInPiss:745740745058811904>`,
          components: [],
        });
        return true;
      } else if (int.customId === "name") {
        changePetName(int, petDocument);
        message.edit({ components: [] })
        return false;
      }
    })
    .catch(() => {
      // User kept pet.
      message.edit({ components: [] });
      return false;
    });

  if(disown) {
    await PetModel.deleteOne({ _id: petDocument._id });
  }
}

const egg = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction, _economy: IEconomy, item: IItem) {
    const [userPets, userInfo] = await Promise.all([
      PetModel.find({ id: interaction.user.id }).lean(),
      findOneOrCreate({ id: interaction.user.id }, { id: interaction.user.id }, User)
    ]);

    if(userPets.length >= 10 && userInfo.premium === false) {
      sendError(interaction, "Non premium users cannot have more than 10 pets at the same time!");
      return false;
    }

    if(userPets.length >= 20) {
      sendError(interaction, "Premium users cannot have more than 20 pets at the same time!");
      return false;
    }

    await interaction.reply({
      content: "<a:Loading:727148666837663765> Hatching...",
    });

    let animal = null, shadow = false, vials;
    const chance = parseFloat((Math.random() * 100).toFixed(3));
    if(item.name2 === "softboiledegg") {
      if (chance <= 100.33) animal = "Sparky";
      else if (chance <= 36.99) animal = "Quaggi";
      else if (chance <= 37.49) animal = "Chimpmunk"; 
      else if (chance <= 37.51) animal = "Furrloin";
      else if (chance <= 37.515) animal = "Doyle"; 
      else animal = "xps";
    } else if (item.name2 === "mediumboiledegg") {
      if (chance <= 25) animal = "Sparky";
      else if (chance <= 45) animal = "Quaggi";
      else if (chance <= 47) animal = "Chimpmunk";
      else if (chance <= 47.01) animal = "Furrloin";
      else if (chance <= 47.001) animal = "Doyle";
      else vials = 1;
    } else if (item.name2 === "hardboiledegg") {
      if (chance <= 5) animal = "Sparky";
      else if (chance <= 30.33) animal = "Quaggi";
      else if (chance <= 42.93) animal = "Chimpmunk"; 
      else if (chance <= 47.93) animal = "Furrloin";
      else if (chance <= 49.43) animal = "Doyle"; 
      else { 
        const chance = rnd(0, 100);
        if(chance <= 75) vials = 1;
        else if(chance <= 95) vials = 2;
        else vials = 3;
      }
    }

    if(!animal) return false;
    if(animal === "xps") {
      const xpGet = rnd(0, 25);
      interaction.editReply({
        content: `<a:RedTick:736282199258824774> | Hatching Process failed, but you received **\`+${xpGet}\`** **XPs** for trying ✨`
      });
      await Economy.updateOne({ id: interaction.user.id }, { $inc: { xp: xpGet }, lastUse: Date.now() });
      return true;
    }
    if(vials) {
      interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Hatching Failed 🍳")
            .setDescription(
              `<a:RedTick:736282199258824774> | *${interaction.user} tried their absolute best to Hatch a Pet but their Clumsiness costed them the whole process..* <:EricaSobbing:897930587518677002>\n<a:righter_arrow:791016331004215297> Atleast they were Able to secure <:GrowthVial:941010304119238666> \`x${vials}\` **Growth Vial** <a:VialFormation:945012487579897886>`
            ),
        ],
      });	
      await addItemToUser(interaction.user.id, "growth vial", vials);
      return true;
    }

    // shadow
    const shadowChance = rnd(0, 300);
    if(shadowChance === 111) shadow = true;

    // stats
    const petStats: Record<string, number> = {
      attack: 0,
      intelligence: 0,
      speed: 0,
    };
    let statsDescription = "";

    // only generate 3, since others can just be defaulted
    const statsArr = generateSkills(shadow ? 30 : 15, 3);
    let i = 0;
    for(const stat in petStats) {
      petStats[stat] = statsArr[i];
      statsDescription += `⁍ **\`${capitalize(stat)}\`** » **${statsArr[i]}**\n`;
      ++i;
    }

    const pet = resolvePet(animal);
    if(!pet) return false;

    // add pet
    const petDocument = await new PetModel({
      id: interaction.user.id,
      species: pet.species,
      UID: pet.UID,
      sprite: shadow ? pet.shadowSprite : pet.sprite,
      petType: shadow ? "SHADOW" : "REGULAR",
      current: userPets.length == 0 ? true : false,
      name: `${interaction.user.username}'s ${pet.name}`.slice(0, 25),
      attributes: petStats
    }).save();

    if(!userInfo.hatched || !userInfo.hatched?.[pet.species]) {
      if(!userInfo.hatched) userInfo.hatched = {};
      userInfo.hatched[pet.species] = true;
      await User.updateOne({ id: interaction.user.id }, { hatched: userInfo.hatched });
    }

    displayPet(interaction, pet, petDocument, shadow, statsDescription);
    
    // Badges
    if(shadow) {
      const attempt = await giveBadge(interaction.user.id, "shadow spotter");
      if(attempt === null) return;
      const [success, badge] = attempt;
      if(success) {
        interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `[𝙎] | ${interaction.user} **is being awarded with the badge: __${badge.name}__** ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
              ),
          ],
        });
      }
    }

    const badgesStatus = Object.values(userInfo.hatched);
    if(badgesStatus.length === 6 && badgesStatus.every(Boolean)) {
      const attempt = await giveBadge(interaction.user.id, "hatched em' all");
      if(attempt === null) return;
      const [success, badge] = attempt;
      if(success) {
        interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                `<:HardBoiledEgg:922055217539854337><:MediumBoiledEgg:922055217950887956><:SoftBoiledEgg:922055207192506408> | ${interaction.user} **is being awarded with the badge: __${badge.name}__** ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
              ),
          ],
        });
      }
    }

    // missions
    const missions: Record<string, number> = {};
    const promises = [];
    switch(item.name2) {
      case "softboiledegg": 
        missions["use_Soft"] = 1;
        break;   
      case "mediumboiledegg": 
        missions["use_Medium"] = 1;
        break;   
      case "hardboiledegg": 
        missions["use_Hard"] = 1;
        break;
    }
    if(animal === "Sparky") missions["hatch_Sparky"] = 1;
    if(animal === "Quaggi") missions["hatch_Quaggi"] = 1;
    if(animal === "Chimpmunk") missions["hatch_Chimpmunk"] = 1;
    promises.push(doWeeklyMissions(interaction.user.id, missions));
    // furrlion only exists on monthly missions:
    if(animal === "Furrlion") missions["hatch_Furrlion"] = 1;
    promises.push(doMonthlyMissions(interaction.user.id, missions));

    Promise.all(promises);
    return true;
  },
};

const growthvial = {
  supportsQuantity: true,
  waitForSuccess: true,
  async use(interaction: CommandInteraction, economy: IEconomy, item: IItem, quantity: number) {
    if(quantity < 25) {
      sendError(interaction, `You need atleast **25** __Growth Vials__ to create **1** __Growth Serum__.\nYou have: \`x${economy.items.find((i) => i.name === item.name)?.count || 0}\` **${item.name}** ${item.icon} <a:exclamation:741988026296696872>`)
      return false;
    }

    const serums = Math.trunc(quantity/25);
    
    await addItemToUser(interaction.user.id, "growth serum", serums);

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setThumbnail("https://i.imgur.com/TZyr4n3.gif")
          .setTitle("Growth Serum Obtained ⚗")
          .setDescription(
            `<a:GreenTick:736282149094949096> | ${interaction.user} Mixed \`x${quantity}\` **${item.name}s** ${item.icon} -> \`x${serums}\` **Growth Serum** <a:GrowthSerum:941010305943736351>\n\n` +
              "⪼ `This item can be used to facilitate Evolution of any Base or Middle Form Pet to their Subsequent Form thus improving their Attributes, Skills, Moveset, etc` <:EricaEvilPlotting:897841584647847986>"
          ),
      ],
    });

    return true;
  }
}

const petfood = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction, _economy: IEconomy, item: IItem) {
    const selectedPet = await PetModel.findOne({ id: interaction.user.id, current: true }).lean();
    if(!selectedPet) {
      sendError(interaction, "Please select a pet first!");
      return false;
    }
    if(selectedPet.attributes.energy > 90 && selectedPet.attributes.hunger > 90) {
      sendError(interaction, `**${selectedPet.name}** is not feeling tired nor hungry!`);
      return false;
    }

    await PetModel.updateOne(
      { _id: selectedPet._id },
      {
        $set: {
          "attributes.energy": 100,
          "attributes.hunger": 100,
        },
      }
    );

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#FF69B4")
          .setThumbnail("https://i.imgur.com/MSiP7Xt.gif")
          .setAuthor({
            name: `${interaction.user} used Pet Food 🍖`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(
            `🢂 Your Selected Pet: **\`${selectedPet["name"]}\`** Enjoyed a healthy meal made specially for them and ended full of Energy and no Hunger! ${item.icon}\n\n*This should help you Win atleast a few Brawls* <a:YAY:783693442747727912>`
          ),
      ],
    });					
  
    return true;
  }
}

const lovepotion = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction) {
    const selectedPet = await PetModel.findOne({ id: interaction.user.id, current: true }).lean();
    if(!selectedPet) {
      sendError(interaction, "Please select a pet first!");
      return false;
    }
    if(selectedPet.attributes.love > 90) {
      sendError(interaction, `**${selectedPet.name}** already loves you alot!`);
      return false;
    }

    await PetModel.updateOne(
      { _id: selectedPet._id },
      {
        $set: {
          "attributes.love": 100,
        },
      }
    );

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#FF69B4")
          .setThumbnail("https://i.imgur.com/jK917Pb.gif")
          .setAuthor({
            name: `${interaction.user} used Love potion 💝`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🢂 Your Selected Pet: **\`${selectedPet["name"]}\`** Raised their Love attribute from ${selectedPet["attributes"]["love"]} --> **100** <a:heart_gif:731170667671584860>\n\n*We Can definitely see the new found Love oozing between you & your Pet* <:LoveyDovey:731169944775032852>`
          ),
      ],
    });					
								
    return true;
  }
}

export function register(collection: Collection<string, UsableItem>) {
  collection.set("softboiledegg", egg);
  collection.set("mediumboiledegg", egg);
  collection.set("hardboiledegg", egg);

  collection.set("growthvial", growthvial);
  collection.set("petfood", petfood);
  collection.set("lovepotion", lovepotion);
}
