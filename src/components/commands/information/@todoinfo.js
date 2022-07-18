/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const Discord = require("discord.js");
const items = require("../../../data/json/items.json");
const badges = require("../../../data/json/badges.json");
const petsJSON = require("../../../data/json/pets.json");

const petsJSONParsed = JSON.parse(JSON.stringify(petsJSON)).pets;
const SkillsManager = require("../../util/pets/skills/SkillsManager");
const petUtils = require("../../util/pets/petUtils");

function generateMoveset(skill) {
  const moveset = skill.getFightInfo();
  let tooltip = "MOVESET:\n\n";
  for (const _ in moveset) {
    tooltip += ` > ${moveset[_].name}\n`;
    tooltip += `   - ${moveset[_].description}\n\n`;
  }
  return `[Moveset](https://patrolbot.xyz/pets "${tooltip}")`;
}

function generateSkills(skill) {
  const skills = skill.getActiveSkillInfo();
  let tooltip = "SKILLS:\n\n";
  for (const _ in skills) {
    tooltip += ` > ${skills[_].name} (${skills[_]?.type || "UNKNOWN"})\n`;
    tooltip += `   - ${skills[_].description}\n\n`;
  }
  return `[Skills](https://patrolbot.xyz/pets "${tooltip}")`;
}

function generatePetInfo(specificPet, skillsObj) {
  let petInfo = "";
  // petInfo += `Rarity: __${specificPet['rarity']}__\n`;
  // petInfo += `Species: __${petUtils.capitalize(specificPet['species'])}__\n`;
  // petInfo += `UID: \`${specificPet['UID']}\` \`-\` Evolution **\`${specificPet['id']}\`**\n`;
  // petInfo += `‣ **\`Species:\`** **${petUtils.capitalize(specificPet['species'])}**\n`;
  petInfo += `‣ **\`Rarity:\`** **${specificPet.rarity}**\n`;
  petInfo += `‣ **\`UID:\`** \`#${specificPet.UID}\`\n`;
  petInfo += `‣ \`Evolution: ${specificPet.id}\` ${"⭐".repeat(specificPet.id)}\n`;
  petInfo += `${generateMoveset(skillsObj)} | ${generateSkills(skillsObj)}\n`;
  return petInfo;
}

module.exports = {
  name: "info",
  description: "🍞",
  usage: "info item/badge <Item/Badge/Pets Name>",
  category: "information",
  cooldown: 1,
  example: "https://i.imgur.com/ZwVLk6A.gif",
  run: async (client, message, args) => {
    //= ============
    const randomFooter = ["!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "ꜱᴜʙᴍɪᴛ ʏᴏᴜʀ ᴏᴡɴ !ᴛᴏᴘɪᴄꜱ", "ᴠɪꜱɪᴛ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ ✨", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "!ꜱꜰᴡ ᴏɴ ʀᴇᴍᴏᴠᴇs ᴛʜᴇ 🔞", "!ᴛᴄᴍᴅ ᴅɪsᴀʙʟᴇꜱ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ", "!ᴄʜɪʙɪ ᴛᴏ ʀᴇᴅᴜᴄᴇ ɢɪꜰ ꜱɪᴢᴇ", "ᴛʜᴇʀᴇ'ꜱ ᴇᴀꜱᴛᴇʀ ᴇɢɢꜱ ᴛᴏᴏ?!🤐", "!how-to <ᴄᴍᴅ> ɪꜱ ʜᴇʟᴘꜰᴜʟ", "!50-50 ᴛᴏ ꜱᴇᴇ ɢᴏʀᴇ ☠", "!ᴜᴘᴅᴀᴛᴇꜱ ꜰᴏʀ ɴᴇᴡ ɪɴꜰᴏ", "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)", "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)", "'!ʀᴇᴘꜱ ɪɴꜰᴏ' ꜰᴏʀ ᴇxᴛʀᴀ 📚🤓", "ʏᴏᴜ ʟᴏꜱᴇ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛᴀxᴇꜱ ᴇᴠᴇʀʏᴅᴀʏ!", "ʀᴇᴘᴏʀᴛ ᴀɴʏ ʙᴜɢ ʙʏ !ʙᴜɢʀᴇᴘᴏʀᴛ ꜰᴏʀ 🍪", "ᴘʀᴇᴍɪᴜᴍ ɪꜱ ᴊᴜꜱᴛ $3.99/ᴍᴏɴᴛʜ🌟(ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ)", "ᴄᴏᴅᴇ: 'ʟᴇᴛꜱɢᴏ' ꜰᴏʀ 10% ᴏꜰꜰ (ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ) 💲", "ᴏᴘᴇɴ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ᴛᴏ ʟᴇᴠᴇʟ ᴜᴘ ꜰᴀꜱᴛ!", "!ʙᴏᴏꜱᴛᴇʀs ᴛᴏ ᴇᴀʀɴ ᴀ ᴅᴀɪʟʏ ᴍʏꜱᴛᴇʀʏ ʙᴏx & ᴄᴏɪɴꜱ 😋", "ᴛʏᴘᴇ: !ᴄᴍᴅꜱ ᴛᴏ ɢᴇᴛ ʟɪꜱᴛ ᴏꜰ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ 🤩", "'!ᴛᴄᴍᴅ ʀᴏʙ' ᴛᴏ ᴅɪꜱᴀʙʟᴇ ᴀʟʟ ʀᴏʙʙɪɴɢ ɪɴ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀ 🚔", "!ꜱᴇᴛᴄʀᴜᴄɪꜰʏ ᴛᴏ ᴄʜᴀɴɢᴇ ᴄʀᴜᴄɪꜰʏ ʟɪᴍɪᴛ", "Always do !ᴛᴀꜱᴋ ɪɴꜰᴏ <ᴄᴏᴅᴇ> more starting a mission!", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ", "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏", "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞", "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞", "ꜰɪɴᴅ ᴇɢɢꜱ ᴛᴏ ʜᴀᴛᴄʜ ᴄᴏᴏʟ ᴘᴇᴛꜱ 🥚", "!ᴠᴏᴛᴇ ᴄᴀɴ ɴᴏᴡ ɢɪᴠᴇ ʏᴏᴜ ᴇɢɢꜱ 🥚", "ᴘᴇᴛ ʜᴇʟᴘ ʏᴏᴜ ᴡɪᴛʜ ᴛʜᴇɪʀ ᴜɴɪQᴜᴇ ꜱᴋɪʟʟꜱ ᴏʀ ᴛᴏ ʙᴀᴛᴛʟᴇ ᴏᴛʜᴇʀ ᴜꜱᴇʀꜱ!", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ʏᴏᴜ ɴᴇᴇᴅ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ᴛᴏ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ!", "ᴏɴʟʏ ᴡᴀʏ ᴛᴏ ᴏʙᴛᴀɪɴ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ɪꜱ ʙʏ ᴜꜱɪɴɢ x25 ɢʀᴏᴡᴛʜ ᴠɪᴀʟꜱ!", "7 ᴅʀᴀɢᴏɴ ʙᴀʟʟꜱ ᴀʀᴇ ʀᴀʀᴇꜱᴛ ᴋɴᴏᴡɴ ɪᴛᴇᴍꜱ ᴡʜɪᴄʜ ᴄᴏᴜʟᴅ ɢʀᴀɴᴛ ᴜꜱᴇʀ'ꜱ ᴀɴʏ ᴡɪꜱʜ!", "ᴘᴜᴛ ʏᴏᴜʀ ᴘᴇᴛ ᴜᴘ ꜰᴏʀ ꜱᴀʟᴇ ᴏʀ ʙᴜʏ ᴏɴᴇ ᴜꜱɪɴɢ !ᴘᴇᴛ-ꜱᴀʟᴇ ᴄᴏᴍᴍᴀɴᴅ!", "ᴛʏᴘᴇ: !command <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎", "ᴛʏᴘᴇ: !command <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ", "Type: !info item/badge/pet <Name> to know more 🔎", "Type: !info item/badge/pet <Name> to know more 🔎", "ᴡʜᴇɴ ʏᴏᴜ ᴅɪᴠᴏʀᴄᴇ ꜱᴏᴍᴇᴏɴᴇ, ɪᴛ ɢɪᴠᴇꜱ 50% ᴏꜰ ʏᴏᴜʀ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛʜᴇ ᴇꜱᴛʀᴀɴɢᴇᴅ ꜱᴘᴏᴜꜱᴇ!", "ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛᴏ ᴅᴏ ᴀ ᴘʀᴇɴᴜᴘ ᴡʜᴇɴ ᴍᴀʀʀʏɪɴɢ ꜱᴏᴍᴇᴏɴᴇ ᴛᴏ ᴀᴠᴏɪᴅ ʟᴏꜱɪɴɢ ᴅɪᴠᴏʀᴄᴇ ᴍᴏɴᴇʏ 🤞", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼"];
    const FOOTER = randomFooter[Math.floor(Math.random() * randomFooter.length)];
    //= =============

    if (!args[0]) {
      return message.channel.send({
        embeds: [new Discord.MessageEmbed().setColor("#FF0000")
          .setTitle("No input found ❌")
          .setDescription("__**Usage:**__ `!info Item/Badge/Pet <Item/Badge/Pet Name>`")],
      });
    }

    if (args[0].toLowerCase() == "item" || args[0].toLowerCase() == "items") { // ITEMS ==============================
      const query = args.slice(1).join(" ");

      if (query.length <= 0) {
        const List1 = [];
        const List2 = [];
        let desc1 = "";
        let desc2 = "";
        for (let i = 0; i < 25; i++) List1.push(items.items[i]);
        for (let j = 25; j < items.items.length; j++) List2.push(items.items[j]);
        for (item of List1) desc1 += `➢ ${item.icon} __**${item.name}**__ - ${item.price === null ? "<:NotForSale:937022934051074138>" : `**${item.price}** <a:Coins:775714101564276756>`} **|** \`𝘐𝘵𝘦𝘮 𝘛𝘺𝘱𝘦: ${item.type}\`\n\n`;// ➜ ${item.description}\n\n`;
        for (item of List2) desc2 += `➢ ${item.icon} __**${item.name}**__ - ${item.price === null ? "<:NotForSale:937022934051074138>" : `**${item.price}** <a:Coins:775714101564276756>`} **|** \`𝘐𝘵𝘦𝘮 𝘛𝘺𝘱𝘦: ${item.type}\`\n\n`;// ➜ ${item.description}\n\n`;

        await message.author.send({
          embeds: [new Discord.MessageEmbed()
            .setColor("#3dc6b9")
            .setTitle("🌮 Items List:")
            .setThumbnail("https://i.imgur.com/u50xGum.gif")
            .setDescription(`${desc1} `)],
        }).catch(() => console.log("DM's closed")).then(message.channel.send(`${message.author}, Check your DMs for all the Information on Items in Patrol Bot <a:CookieEat:796470767336161280>`));

        message.author.send({ embeds: [new Discord.MessageEmbed().setFooter({ text: "For information about an individual Item, type: info item <Item Name> ☕" }).setDescription(`${desc2} `).setColor("#3dc6b9")] }); return;
      }

      const result = items.items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
        if (a.name > b.name) return 1;
        if (b.name > a.name) return -1;
        return 0;
      });
      if (result.length < 1) {
        return message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("#FF0000")
            .setTitle("Search Failed ‼")
            .setDescription("The item you searched for does NOT exist <a:exclamation:741988026296696872>\n`Make sure your spelling is correct and that there are no double spaces`")],
        });
      }

      if (result.length === 1) {
        return message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("RANDOM").setFooter({ text: `➤ ${FOOTER}` })
            .setTitle("🔍 Item matching your query:")
            .setDescription(`➢ **Name:** ${result[0].name} ${result[0].icon}\n➢ **Type:** \`${result[0].type}\`\n➢ **Price:** ${result[0].price} <a:Coins:775714101564276756> ~ **Sell Price:** ${result[0].sellPrice} <a:Coins:775714101564276756>\n➢ **Collateral Price:** ${result[0].collateralPrice} 💱\n➢ **Description:** *${result[0].description}*\n➢ **Usage:** ${result[0].usage}\n\n• Can be used? **${result[0].data.canBeUsed}**\n• Can be bought? **${result[0].data.canBeBought}**\n• Can be sold? **${result[0].data.canBeSold}**\n• Can be Traded? **${result[0].data.canBeTraded}**`)],
        });
      } if (result.length > 1) {
        message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("RANDOM")
            .setTitle(`🔍 Found ${result.length} items matching your query:`)
            .setDescription(`${result.map((v, i) => `${i + 1}. **${v.name}** ${v.icon}\n`).toString().replace(/,/g, "")}\n➤ *Choose the Item Number within the next 60 seconds* <a:HamsterJigga:731172699639906397>`)],
        });

        const filter = (m) => Number.isInteger(Number(m.content)) && result[Number(m.content) - 1] && m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });
        collector.on("collect", (m) => message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("RANDOM").setFooter({ text: `➤ ${FOOTER}` })
            .setTitle("🔍 Item matching your query:")
            .setDescription(`➢ **Name:** ${result[Number(m.content) - 1].name} ${result[Number(m.content) - 1].icon}\n➢ **Type:** \`${result[Number(m.content) - 1].type}\`\n➢ **Price:** ${result[Number(m.content) - 1].price} <a:Coins:775714101564276756> ~ **Sell Price:** ${result[Number(m.content) - 1].sellPrice} <a:Coins:775714101564276756>\n➢ **Collateral Price:** ${result[Number(m.content) - 1].collateralPrice} 💱\n➢ **Description:** *${result[Number(m.content) - 1].description}*\n➢ **Usage:** ${result[Number(m.content) - 1].usage}\n\n• Can be used? **${result[Number(m.content) - 1].data.canBeUsed}**\n• Can be bought? **${result[Number(m.content) - 1].data.canBeBought}**\n• Can be sold? **${result[Number(m.content) - 1].data.canBeSold}**\n• Can be Traded? **${result[Number(m.content) - 1].data.canBeTraded}**`)],
        }));
      }
    } else if (args[0].toLowerCase() == "badge" || args[0].toLowerCase() == "badges") { // BADGES ==============================
      const query = args.slice(1).join(" ");

      if (query.length <= 0) {
        const List1 = [];
        const List2 = [];
        let desc1 = "";
        let desc2 = "";
        for (let i = 0; i < 20; i++) List1.push(badges.badges[i]);
        for (let j = 20; j < badges.badges.length; j++) List2.push(badges.badges[j]);
        for (item of List1) desc1 += `• ${item.badge} __**${item.name}**__ **|** ${item.description}\n`;
        for (item of List2) desc2 += `• ${item.badge} __**${item.name}**__ **|** ${item.description}\n`;

        await message.author.send({
          embeds: [new Discord.MessageEmbed()
            .setColor("#3dc6b9")
            .setTitle("📛 Badge List:")
            .setThumbnail("https://i.imgur.com/NVptd4F.gif")
            .setDescription(`${desc1} `)],
        }).catch(() => console.log("DM's closed")).then(message.channel.send(`${message.author}, Check your DMs for all the Information on Badges in Patrol Bot <a:CookieEat:796470767336161280>`));
        message.author.send({ embeds: [new Discord.MessageEmbed().setDescription(`${desc2}`).setColor("#3dc6b9")] }).catch(() => message.channel.send("`Oh, nevermind. Your DM's are`**`CLOSED!`** <:sus:715633189871419554>")); return;
      }

      const result = badges.badges.filter((badge) => badge.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
        if (a.name > b.name) return 1;
        if (b.name > a.name) return -1;
        return 0;
      });
      if (result.length < 1) {
        return message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("#FF0000")
            .setTitle("Search Failed ‼")
            .setDescription("The Badge you searched for does NOT exist <a:exclamation:741988026296696872>\n`Make sure your spelling is correct and that there are no double spaces`")],
        });
      }

      if (result.length === 1) {
        return message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("RANDOM").setFooter({ text: `➤ ${FOOTER}` })
            .setTitle("🔍 Badge matching your query:")
            .setDescription(`➢ **Name:** ${result[0].name} ${result[0].badge}\n➢ **Description:** *${result[0].description}*`)],
        });
      } if (result.length > 1) {
        message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("RANDOM")
            .setTitle(`🔍 Found ${result.length} Badges matching your query:`)
            .setDescription(`${result.map((v, i) => `${i + 1}. **${v.name}** ${v.badge}\n`).toString().replace(/,/g, "")}\n➤ *Choose the Badge Number within the next 60 seconds* <a:HamsterJigga:731172699639906397>`)],
        });

        const filter = (m) => Number.isInteger(Number(m.content)) && result[Number(m.content) - 1] && m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });
        collector.on("collect", (m) => message.channel.send({
          embeds: [new Discord.MessageEmbed().setColor("RANDOM").setFooter({ text: `➤ ${FOOTER}` })
            .setTitle("🔍 Badge matching your query:")
            .setDescription(`➢ **Name:** ${result[Number(m.content) - 1].name} ${result[Number(m.content) - 1].badge}\n➢ **Description:** *${result[Number(m.content) - 1].description}*`)],
        }));
      }
    } else if (args[0].toLowerCase() == "pet" || args[0].toLowerCase() == "pets") { // BADGES ==============================
      let specificPet = args[1];
      !specificPet && (specificPet = null);
      specificPet && (
        specificPet = (petsJSON.find((e) => e.name?.toLowerCase() === specificPet?.toLowerCase())) || (petsJSON.find((e) => e.UID === parseInt(args[1]))) || null
      );

      // Has a specified pet the user wants to checkup.
      if (specificPet) {
        const skillsObj = SkillsManager.getSkill(specificPet.UID);

        const otherEvolutions = petsJSON.filter((e) => e.species === specificPet.species && e.id !== specificPet.id).sort((a, b) => a.id - b.id);
        let otherEvolutionsValue = "";
        otherEvolutionsValue += `⦾ ${otherEvolutions[0].name} ${otherEvolutions[0].sprite} (**EVO ${otherEvolutions[0].id}**)\n`;
        otherEvolutionsValue += `⦿ ${otherEvolutions[1].name} ${otherEvolutions[1].sprite} (**EVO ${otherEvolutions[1].id}**)\n`;

        let petInfo = "";
        petInfo += `‣ **\`Species:\`** __**${petUtils.capitalize(specificPet.species)}**__\n`;
        petInfo += `‣ **\`Rarity:\`** **${specificPet.rarity}**\n`;
        petInfo += `‣ **\`UID:\`** \`#${specificPet.UID}\` | \`Evolution: ${specificPet.id}\` ${"⭐".repeat(specificPet.id)} `;

        let movesetField = "";
        const moveset = skillsObj.getFightInfo();
        for (const _ in moveset) {
          movesetField += `➛ **\`${moveset[_].name}\`**\n`;
          movesetField += `> *${moveset[_].description}*\n`;
        }

        let skillsField = "";
        const skills = skillsObj.getActiveSkillInfo();
        for (const _ in skills) {
          skillsField += `➛ **\`${skills[_].name}\`** (${skills[_]?.type || "UNKNOWN"})\n`;
          skillsField += `> *${skills[_].description}*\nᴄᴏᴏʟᴅᴏᴡɴ: ${skills[_].cooldown}s\n`;
        }

        const specificPetEmbed = new Discord.MessageEmbed()
          .setAuthor({ name: `Pet Information: ${specificPet.name}`, iconURL: "https://i.imgur.com/PztQ9QP.gif" })
          .setColor(petUtils.getColorByRarity(specificPet.rarity))
          .setThumbnail(`https://cdn.discordapp.com/emojis/${specificPet.sprite.split(":")[2].replace(">", "")}.gif`)
          .setDescription(`${petInfo}`)
          .addField("🡆 __Moveset__ 👊", movesetField, true)
          .addField("🡆 __Skills__ 🪄", skillsField, true)
          .addField("🡆 __Evolutions__:", otherEvolutionsValue);

        message.channel.send({ embeds: [specificPetEmbed] });
      } else {
        // Display the pets menu.
        message.channel.send({
          embeds: [
            new Discord.MessageEmbed().setColor("GREEN").setDescription(":white_check_mark: **|** Please check your DMs!"),
          ],
        });
        await displayAllPetInfo(message);
      }
    } else {
      return message.channel.send({
        embeds: [new Discord.MessageEmbed().setColor("#FF0000")
          .setTitle("Mention Item or Badge ‼")
          .setDescription("__**Usage:**__ `!info Item/Badge/Pet <Item/Badge/Pet Name>`")],
      });
    }
  },
};

async function displayAllPetInfo(message) {
  let embedMessage;

  let selectedSpecies = "DOG";
  const allSpecies = [...new Set(petsJSON.map((e) => e.species))]; // set constructing gets rid of duplicates.

  async function updateFrame() {
    const selectMenuOptions = [];
    for (const _ of allSpecies) {
      selectMenuOptions.push(
        {
          emoji: petsJSON.find((e) => (e.species === _ && e.id === 1))?.sprite,
          label: petUtils.capitalize(_),
          description: `List all pets that are ${petUtils.capitalize(_)} species.`,
          value: _,
          default: (_ === selectedSpecies),
        },
      );
    }

    const components = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("species")
          .addOptions(selectMenuOptions),
      );

    const pets = petsJSON.filter((e) => e.species === selectedSpecies);
    const embedFields = [];
    for (const pet of pets) {
      embedFields.push({
        name: `🡆 ${pet.name} ${pet.sprite}`,
        value: generatePetInfo(pet, SkillsManager.getSkill(pet.UID)),
        inline: true,
      });
    }
    embedFields[2].inline = false;

    const mainEmbed = new Discord.MessageEmbed()
      .setColor(petUtils.getColorByRarity(pets[0]?.rarity))
    // .setDescription(`**Here are all the pets that is a ${petUtils.capitalize(selectedSpecies)} species.**`)
    // .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setAuthor({ name: `Pets Information: ${petUtils.capitalize(selectedSpecies)}s\n`, iconURL: "https://i.imgur.com/PztQ9QP.gif" })
      .addFields(embedFields);

    if (!embedMessage) embedMessage = await message.author.send({ embeds: [mainEmbed], components: [components] });
    else await embedMessage.edit({ embeds: [mainEmbed], components: [components] });
  }
  await updateFrame();

  const collector = await embedMessage.createMessageComponentCollector({
    componentType: "SELECT_MENU",
    idle: 60_000,
  });

  collector.on("collect", async (interaction) => {
    await interaction.deferUpdate();
    allSpecies.includes(interaction?.values[0]) && (selectedSpecies = interaction?.values[0]);
    await updateFrame();
  });

  collector.on("end", async (_, r) => {
    if (r === "idle") await embedMessage.edit({ content: "This interaction has expired and is no longer valid.", components: [] });
  });
}
