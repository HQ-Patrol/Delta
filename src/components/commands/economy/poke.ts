import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageEmbed } from "discord.js";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import DeltaClient from "../../../utilities/classes/DeltaClient";
import findUserById from "../../../database/functions/economy/findUserById";

@ApplyOptions<Command.Options>({
  name: "poke",
  description: "Poke someone to annoy them or poke a random person to get some 🤑",
})

export class PokeCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Want to Poke somebody?")
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {

    let person = interaction.options.getUser("user");
    if (person) {
      if (person.id == interaction.user.id) return interaction.reply("Please mention another user or user ID correctly! 😐")
      
      let random = ["https://i.imgur.com/DCAOVVy.gif","https://i.imgur.com/UXS0LCi.gif","https://i.imgur.com/rNjcZzN.gif","https://i.imgur.com/EqE47oD.gif","https://i.imgur.com/52hWG0C.gif","https://i.imgur.com/OO2lMtK.gif","https://i.imgur.com/HoJKsuY.gif","https://i.imgur.com/noxUcMY.gif","https://i.imgur.com/fnXVXOZ.gif","https://i.imgur.com/Hj51pF3.gif","https://i.imgur.com/FcdrZmZ.gif","https://i.imgur.com/2oVRZg1.gif","https://i.imgur.com/6icckJh.gif","https://i.imgur.com/GtsLOaU.gif","https://i.imgur.com/C5uhFBF.gif","https://i.imgur.com/VggruHg.gif","https://i.imgur.com/vyYcXiz.gif"]
      let gif = random[Math.floor(Math.random() * random.length)]

      let embed = new MessageEmbed()
                          .setColor("RANDOM")
                          .setDescription(`${interaction.user} poked <@${person.id}> 💢`)
                          .setImage(gif);
        
                return interaction.reply({embeds: [embed]});

      }

    if (
        (interaction.client as DeltaClient).cooldowns.poke.get(
          interaction.user.id
        ) > Date.now()
      ) {
        interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setColor("#FF0000")
                .setDescription(
                  `Please wait for another **${(
                    ((interaction.client as DeltaClient).cooldowns.poke.get(
                      interaction.user.id
                    ) -
                      Date.now()) /
                    1000
                  ).toFixed(
                    1
                  )}s** before poking someone <a:exclamation:741988026296696872>`
                ),
            ],
          })
      } else {

        //=============
	let randomFooter = ["!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "ꜱᴜʙᴍɪᴛ ʏᴏᴜʀ ᴏᴡɴ !ᴛᴏᴘɪᴄꜱ", "ᴠɪꜱɪᴛ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ ✨", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "!ꜱꜰᴡ ᴏɴ ʀᴇᴍᴏᴠᴇs ᴛʜᴇ 🔞", "!ᴛᴄᴍᴅ ᴅɪsᴀʙʟᴇꜱ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ", "!ᴄʜɪʙɪ ᴛᴏ ʀᴇᴅᴜᴄᴇ ɢɪꜰ ꜱɪᴢᴇ", "ᴛʜᴇʀᴇ'ꜱ ᴇᴀꜱᴛᴇʀ ᴇɢɢꜱ ᴛᴏᴏ?!🤐", "!how-to <ᴄᴍᴅ> ɪꜱ ʜᴇʟᴘꜰᴜʟ", "!50-50 ᴛᴏ ꜱᴇᴇ ɢᴏʀᴇ ☠", "!ᴜᴘᴅᴀᴛᴇꜱ ꜰᴏʀ ɴᴇᴡ ɪɴꜰᴏ", "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)", "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)", "'!ʀᴇᴘꜱ ɪɴꜰᴏ' ꜰᴏʀ ᴇxᴛʀᴀ 📚🤓", "ʏᴏᴜ ʟᴏꜱᴇ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛᴀxᴇꜱ ᴇᴠᴇʀʏᴅᴀʏ!", "ʀᴇᴘᴏʀᴛ ᴀɴʏ ʙᴜɢ ʙʏ !ʙᴜɢʀᴇᴘᴏʀᴛ ꜰᴏʀ 🍪", "ᴘʀᴇᴍɪᴜᴍ ɪꜱ ᴊᴜꜱᴛ $3.99/ᴍᴏɴᴛʜ🌟(ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ)", "ᴄᴏᴅᴇ: 'ʟᴇᴛꜱɢᴏ' ꜰᴏʀ 10% ᴏꜰꜰ (ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ) 💲", "ᴏᴘᴇɴ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ᴛᴏ ʟᴇᴠᴇʟ ᴜᴘ ꜰᴀꜱᴛ!", "!ʙᴏᴏꜱᴛᴇʀs ᴛᴏ ᴇᴀʀɴ ᴀ ᴅᴀɪʟʏ ᴍʏꜱᴛᴇʀʏ ʙᴏx & ᴄᴏɪɴꜱ 😋", "ᴛʏᴘᴇ: !ᴄᴍᴅꜱ ᴛᴏ ɢᴇᴛ ʟɪꜱᴛ ᴏꜰ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ 🤩", "'!ᴛᴄᴍᴅ ʀᴏʙ' ᴛᴏ ᴅɪꜱᴀʙʟᴇ ᴀʟʟ ʀᴏʙʙɪɴɢ ɪɴ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀ 🚔", "!ꜱᴇᴛᴄʀᴜᴄɪꜰʏ ᴛᴏ ᴄʜᴀɴɢᴇ ᴄʀᴜᴄɪꜰʏ ʟɪᴍɪᴛ", "Always do !ᴛᴀꜱᴋ ɪɴꜰᴏ <ᴄᴏᴅᴇ> more starting a mission!", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁","ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ", "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏", "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞", "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞", "ꜰɪɴᴅ ᴇɢɢꜱ ᴛᴏ ʜᴀᴛᴄʜ ᴄᴏᴏʟ ᴘᴇᴛꜱ 🥚", "!ᴠᴏᴛᴇ ᴄᴀɴ ɴᴏᴡ ɢɪᴠᴇ ʏᴏᴜ ᴇɢɢꜱ 🥚", "ᴘᴇᴛ ʜᴇʟᴘ ʏᴏᴜ ᴡɪᴛʜ ᴛʜᴇɪʀ ᴜɴɪQᴜᴇ ꜱᴋɪʟʟꜱ ᴏʀ ᴛᴏ ʙᴀᴛᴛʟᴇ ᴏᴛʜᴇʀ ᴜꜱᴇʀꜱ!", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ʏᴏᴜ ɴᴇᴇᴅ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ᴛᴏ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ!", "ᴏɴʟʏ ᴡᴀʏ ᴛᴏ ᴏʙᴛᴀɪɴ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ɪꜱ ʙʏ ᴜꜱɪɴɢ x25 ɢʀᴏᴡᴛʜ ᴠɪᴀʟꜱ!", "7 ᴅʀᴀɢᴏɴ ʙᴀʟʟꜱ ᴀʀᴇ ʀᴀʀᴇꜱᴛ ᴋɴᴏᴡɴ ɪᴛᴇᴍꜱ ᴡʜɪᴄʜ ᴄᴏᴜʟᴅ ɢʀᴀɴᴛ ᴜꜱᴇʀ'ꜱ ᴀɴʏ ᴡɪꜱʜ!", "ᴘᴜᴛ ʏᴏᴜʀ ᴘᴇᴛ ᴜᴘ ꜰᴏʀ ꜱᴀʟᴇ ᴏʀ ʙᴜʏ ᴏɴᴇ ᴜꜱɪɴɢ !ᴘᴇᴛ-ꜱᴀʟᴇ ᴄᴏᴍᴍᴀɴᴅ!", "ᴛʏᴘᴇ: !command <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎", "ᴛʏᴘᴇ: !command <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ", "Type: !info item/badge/pet <Name> to know more 🔎", "Type: !info item/badge/pet <Name> to know more 🔎", "ᴡʜᴇɴ ʏᴏᴜ ᴅɪᴠᴏʀᴄᴇ ꜱᴏᴍᴇᴏɴᴇ, ɪᴛ ɢɪᴠᴇꜱ 50% ᴏꜰ ʏᴏᴜʀ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛʜᴇ ᴇꜱᴛʀᴀɴɢᴇᴅ ꜱᴘᴏᴜꜱᴇ!", "ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛᴏ ᴅᴏ ᴀ ᴘʀᴇɴᴜᴘ ᴡʜᴇɴ ᴍᴀʀʀʏɪɴɢ ꜱᴏᴍᴇᴏɴᴇ ᴛᴏ ᴀᴠᴏɪᴅ ʟᴏꜱɪɴɢ ᴅɪᴠᴏʀᴄᴇ ᴍᴏɴᴇʏ 🤞", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼"]    
  let FOOTER = randomFooter[Math.floor(Math.random() * randomFooter.length)]
        //==============

  await findUserById(interaction.user.id);

  const earn = Math.floor(Math.random() * (100 - 25 + 1)) + 25;

  // let randomUser = interaction.guild.members.cache
  // .filter(m => m.id !== interaction.user.id)
  // .random();

    await interaction.reply({
        embeds: [
          new MessageEmbed()
          .setThumbnail("https://i.imgur.com/Hja6mZU.gif")
          .setColor('#00FF00')
          .setDescription(`You poked **Kanye West** and they gave you **${earn} coins** <a:Coins:775714101564276756>`)
          .setFooter({text: `➤ `+FOOTER})]});

          await Eco.updateOne(
            { id: interaction.user.id },
            { $inc: { coins: earn } }
          );
			
    (interaction.client as DeltaClient).cooldowns.poke.set(
      interaction.user.id,
      Date.now() + 60000
    );
  }
  }
}