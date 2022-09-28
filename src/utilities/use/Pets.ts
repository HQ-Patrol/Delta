import { ButtonInteraction, ColorResolvable, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Collection } from "discord.js";
import { UsableItem } from ".";

import { IItem } from "../../types/Item";
import sendError from "../sendError";
import { giveBadge } from "../badges";
import { Economy, IEconomy } from "../../database/models/EconomyModel";
import { IPet, PetModel } from "../../database/models/PetModel";
import { User } from "../../database/models/UserModel";
import findOneOrCreate from "../../database/functions/findOneOrCreate";
import { capitalize, footer, rnd } from "../global";
import { changePetName, getColorByRarity, resolvePet } from "../query/pets";
import { addItemToUser } from "../query/inventory";
import { IPetResolved } from "../../types/Pet";

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


    return true;
  },
};

export function register(collection: Collection<string, UsableItem>) {
  collection.set("softboiledegg", egg);
  collection.set("mediumboiledegg", egg);
  collection.set("hardboiledegg", egg);
}
