import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageEmbed, GuildMember } from "discord.js";
import { User } from "../../../database/models/UserModel";
import pretty from "pretty-ms";
import { SOTWModel } from "../../../database/models/SOTWModel";

@ApplyOptions<Command.Options>({
  name: "simp",
  description: "Is someone being a simp? You should use this for him 😠",
})
export class SimpCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("Give a simp vote to someone.")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to give a simp vote to.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription("Remove a simp vote from someone.")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to take a simp vote from.")
                .setRequired(true)
            )
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      let randomFooter = [
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
        "!how-to <ᴄᴍᴅ> ɪꜱ ʜᴇʟᴘꜰᴜʟ",
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
        "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁",
        "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁",
        "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁",
        "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️",
        "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️",
        "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️",
        "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️",
        "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️",
        "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞",
        "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞",
        "ꜰɪɴᴅ ᴇɢɢꜱ ᴛᴏ ʜᴀᴛᴄʜ ᴄᴏᴏʟ ᴘᴇᴛꜱ 🥚",
        "!ᴠᴏᴛᴇ ᴄᴀɴ ɴᴏᴡ ɢɪᴠᴇ ʏᴏᴜ ᴇɢɢꜱ 🥚",
        "ᴘᴇᴛ ʜᴇʟᴘ ʏᴏᴜ ᴡɪᴛʜ ᴛʜᴇɪʀ ᴜɴɪQᴜᴇ ꜱᴋɪʟʟꜱ ᴏʀ ᴛᴏ ʙᴀᴛᴛʟᴇ ᴏᴛʜᴇʀ ᴜꜱᴇʀꜱ!",
        "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴",
        "ʏᴏᴜ ɴᴇᴇᴅ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ᴛᴏ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ!",
        "ᴏɴʟʏ ᴡᴀʏ ᴛᴏ ᴏʙᴛᴀɪɴ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ɪꜱ ʙʏ ᴜꜱɪɴɢ x25 ɢʀᴏᴡᴛʜ ᴠɪᴀʟꜱ!",
        "7 ᴅʀᴀɢᴏɴ ʙᴀʟʟꜱ ᴀʀᴇ ʀᴀʀᴇꜱᴛ ᴋɴᴏᴡɴ ɪᴛᴇᴍꜱ ᴡʜɪᴄʜ ᴄᴏᴜʟᴅ ɢʀᴀɴᴛ ᴜꜱᴇʀ'ꜱ ᴀɴʏ ᴡɪꜱʜ!",
        "ᴘᴜᴛ ʏᴏᴜʀ ᴘᴇᴛ ᴜᴘ ꜰᴏʀ ꜱᴀʟᴇ ᴏʀ ʙᴜʏ ᴏɴᴇ ᴜꜱɪɴɢ !ᴘᴇᴛ-ꜱᴀʟᴇ ᴄᴏᴍᴍᴀɴᴅ!",
        "ᴛʏᴘᴇ: !command <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎",
        "ᴛʏᴘᴇ: !command <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎",
        "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴",
        "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴",
        "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ",
        "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ",
        "Type: !info item/badge/pet <Name> to know more 🔎",
        "Type: !info item/badge/pet <Name> to know more 🔎",
        "ᴡʜᴇɴ ʏᴏᴜ ᴅɪᴠᴏʀᴄᴇ ꜱᴏᴍᴇᴏɴᴇ, ɪᴛ ɢɪᴠᴇꜱ 50% ᴏꜰ ʏᴏᴜʀ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛʜᴇ ᴇꜱᴛʀᴀɴɢᴇᴅ ꜱᴘᴏᴜꜱᴇ!",
        "ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛᴏ ᴅᴏ ᴀ ᴘʀᴇɴᴜᴘ ᴡʜᴇɴ ᴍᴀʀʀʏɪɴɢ ꜱᴏᴍᴇᴏɴᴇ ᴛᴏ ᴀᴠᴏɪᴅ ʟᴏꜱɪɴɢ ᴅɪᴠᴏʀᴄᴇ ᴍᴏɴᴇʏ 🤞",
        "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼",
        "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼",
        "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼",
        "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼",
        "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴛᴏ ʟᴇᴀʀɴ ᴀʟʟ ᴀʙᴏᴜᴛ ᴘᴀᴛʀᴏʟ ʙᴏᴛ ᴀɴᴅ ɪᴛ'ꜱ ꜰᴇᴀᴛᴜʀᴇꜱ ‼",
      ];
      let FOOTER =
        randomFooter[Math.floor(Math.random() * randomFooter.length)];
      //==============

      const random = [
        "https://i.imgur.com/AO451CQ.jpg",
        "https://i.imgur.com/K0nSZRq.jpg",
        "https://i.imgur.com/bSdlEg6.gif",
        "https://i.imgur.com/Hodgcpx.jpg",
        "https://i.imgur.com/K9AqOUt.jpg",
        "https://i.imgur.com/aUDIues.jpg",
        "https://i.imgur.com/qbqkMMN.jpg",
        "https://i.imgur.com/vECn1VN.png",
        "https://i.imgur.com/l0M1IeZ.jpg",
        "https://i.imgur.com/IaTtXTn.jpg",
      ];
      const gif = random[Math.floor(Math.random() * random.length)];

      let userData = await User.findOne({ id: interaction.user.id });
      if (!userData)
        userData = await User.create({
          id: interaction.user.id,
          premium: false,
          blacklisted: false,
        });
      const cooldownTime = 7200000;
      const PremiumcooldownTime = cooldownTime / 2;

      const memberz = interaction.options.getMember("user") as GuildMember;
      if (!memberz) {
        const userCooldown2 = userData.Biggercooldown.find(
          (x: any) => x.command === "simp"
        );
        if (!userCooldown2 || userCooldown2.endCooldown <= Date.now()) {
          return interaction.reply("Couldn't find that member!");
        }
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before giving Social Credits to someone else! <a:RedTick:736282199258824774>`
                ),
            ],
          })
          .catch(console.error);
      }

      if (memberz.user.bot)
        return interaction.reply("You didn't possibly just vote a bot😐");

      if (memberz.id === interaction.user.id)
        return interaction.reply("Shut up Simp.");

      const userCooldown2 = userData.Biggercooldown.find(
        (x: any) => x.command === "simp"
      );
      if (!userCooldown2) {
        return interaction.reply(
          `*Looks like you still haven't received your __**Voter ID Card**__ yet 😮*, **Type:** \`/voterid\` to start voting <a:GoVote:787376884731478046>`
        );
      }

      if (userCooldown2.endCooldown > Date.now()) {
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before catching a simp again.`
                ),
            ],
          })
          .catch(console.error);
      } else {
        const tagged = await SOTWModel.findOne({ userID: memberz.id });
        if (!tagged) {
          await SOTWModel.create({
            userID: memberz.id,
            servers: [{ serverID: interaction.guild?.id, SVs: 1, SOTWs: 1 }],
            sotw: 1,
            simpV: 1,
          });
          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }
          let embed = new MessageEmbed()
            .setAuthor({ name: `🚨 SOS SIMP ALERT 🚨` })
            .setColor("RED")
            .setThumbnail(gif)
            .setDescription(
              `${memberz.user} was caught simping by ${interaction.user}`
            )
            .setFooter({ text: `➤ ` + FOOTER });
          await userData.save().catch((err: any) => console.log(err));
          return interaction.reply({ embeds: [embed] });
        }

        let serverVote = tagged.servers.find(
          (x: any) => x.serverID === interaction.guild?.id
        );
        if (!serverVote) {
          tagged.servers.push({
            serverID: (interaction.guild as any).id,
            SVs: 1,
            SOTWs: 1,
          });

          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }
          tagged.sotw = tagged.sotw + 1;
          tagged.simpV = tagged.simpV + 1;

          let embed = new MessageEmbed()
            .setAuthor({ name: `🚨 SOS SIMP ALERT 🚨` })
            .setColor("RED")
            .setThumbnail(gif)
            .setDescription(
              `${memberz.user} was caught simping by ${interaction.user}`
            )
            .setFooter({ text: `➤ ` + FOOTER });

          tagged.save().catch((err: any) => console.log(err));
          await userData.save().catch((err: any) => console.log(err));

          return interaction.reply({ embeds: [embed] });
        } else {
          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }
          tagged.sotw = tagged.sotw + 1;
          tagged.simpV = tagged.simpV + 1;
          serverVote.SVs = serverVote.SVs + 1;
          serverVote.SOTWs = serverVote.SOTWs + 1;

          tagged.save().catch((err: any) => console.log(err));
          await userData.save().catch((err: any) => console.log(err));

          let embed = new MessageEmbed()
            .setAuthor({ name: `🚨 SOS SIMP ALERT 🚨` })
            .setColor("RED")
            .setThumbnail(gif)
            .setDescription(
              `${memberz.user} was caught simping by ${interaction.user}`
            )
            .setFooter({ text: `➤ ` + FOOTER });

          return interaction.reply({ embeds: [embed] });
        }
      }
    } else if (subcommand === "remove") {
      let userData = await User.findOne({ id: interaction.user.id });
      if (!userData)
        userData = await User.create({
          id: interaction.user.id,
          premium: false,
          blacklisted: false,
        });
      const cooldownTime = 14400000;
      const PremiumcooldownTime = cooldownTime / 2;

      const memberz = interaction.options.getMember("user") as GuildMember;
      if (!memberz) {
        const userCooldown2 = userData.Biggercooldown.find(
          (x: any) => x.command === "desimp"
        );
        if (!userCooldown2 || userCooldown2.endCooldown <= Date.now()) {
          return interaction.reply("Couldn't find that member!");
        }
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before voting for a Simp again.`
                ),
            ],
          })
          .catch(console.error);
      }

      if (memberz.user.bot) return interaction.reply("nope");
      if (memberz.id === interaction.user.id)
        return interaction.reply("That's not how it works but ok");

      //if (userData.premium===false) { return interaction.reply("Nice try simp but this is a Premium-only command 🥱");}

      const tagged = await SOTWModel.findOne({ userID: memberz.id });
      if (!tagged) {
        return interaction.reply(
          "Leave the chad alone. He hasn't been caught simping like, ever."
        );
      }

      const userCooldown2 = userData.Biggercooldown.find(
        (x: any) => x.command === "desimp"
      );
      if (!userCooldown2) {
        return interaction.reply(
          `*Looks like you still haven't received your Voter ID Card yet 😮*, **Type:** \`/voterid\` to start voting <a:GoVote:787376884731478046>`
        );
      }
      if (userCooldown2.endCooldown > Date.now()) {
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle(`Command Cooldown ‼`)
                .setColor("RED")
                .setDescription(
                  `Wait another **${pretty(
                    userCooldown2.endCooldown - Date.now()
                  )}** before voting for a Simp again.`
                ),
            ],
          })
          .catch(console.error);
      } else {
        let serverVote = tagged.servers.find(
          (x: any) => x.serverID === (interaction.guild as any).id
        );
        if (!serverVote || serverVote.SVs < 0) {
          return interaction.reply(
            "This chad wasn't ever caught simping. Leave him be!😉"
          );
        } else {
          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }
          tagged.simpV = tagged.simpV - 1;
          serverVote.SVs = serverVote.SVs - 1;

          await userData.save().catch((err: any) => console.log(err));
          tagged.save().catch((err: any) => console.log(err));

          return interaction.reply(
            "`You just removed 1 sin from their simping record`🤕"
          );
        }
      }
    }
  }
}
