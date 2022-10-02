import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageEmbed, GuildMember } from "discord.js";
import { User } from "../../../database/models/UserModel";
import pretty from "pretty-ms";
import { MOTWModel } from "../../../database/models/MOTWModel";
import UserWeeklyMissionsModel from "../../../database/models/UserWeeklyMissionsModel";

@ApplyOptions<Command.Options>({
  name: "modvote",
  description:
    "Are the mods FINALLY not gay and you wanna get your favorite mod that presitigous weekly crown!?",
})
export class ModVoteCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("Give a mod vote to someone.")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to give a mod vote to.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription("Remove a mod vote from someone.")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to take a mod vote from.")
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

      let userData = await User.findOne({ id: interaction.user.id });
      if (!userData)
        userData = await User.create({
          id: interaction.user.id,
          premium: false,
          blacklisted: false,
        });
      const cooldownTime = 43200000;
      const PremiumcooldownTime = cooldownTime / 2;

      const memberz = interaction.options.getMember("user") as GuildMember;
      if (!memberz) {
        const userCooldown2 = userData.Biggercooldown.find(
          (x: any) => x.command === "modvote"
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
                  )}** before voting for the Mod again.`
                ),
            ],
          })
          .catch(console.error);
      }

      if (memberz.user.bot)
        return interaction.reply("You didn't possibly just vote a bot😐");
      if (
        !(
          memberz.permissions.has("BAN_MEMBERS") &&
          memberz.permissions.has("KICK_MEMBERS")
        )
      ) {
        return interaction.reply(
          "That person isn't a Moderator <a:LmaoBlast:741346535358595072>"
        );
      }
      if (memberz.id === interaction.user.id) {
        return interaction.reply(
          "Please for the love of god... || https://i.imgur.com/TTOAKjQ.gif ||"
        );
      }

      const userCooldown2 = userData.Biggercooldown.find(
        (x: any) => x.command === "modvote"
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
                  )}** before voting for the Mod again.`
                ),
            ],
          })
          .catch(console.error);
      } else {
        const tagged = await MOTWModel.findOne({ userID: memberz.id });
        if (!tagged) {
          await MOTWModel.create({
            userID: memberz.id,
            servers: [{ serverID: interaction.guild?.id, MVs: 1, MOTWs: 1 }],
            motw: 1,
            modV: 1,
          });
          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }
          let embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: `👏Good Mod Spotted👏` })
            .setFooter({ text: `➤ ` + FOOTER })
            .setThumbnail("https://i.imgur.com/PPaVaRX.jpg")
            .setDescription(
              `${interaction.user} showed his appreciation for Mod ${memberz.user}!`
            );
          await userData.save().catch((err: any) => console.log(err));
          return interaction.reply({ embeds: [embed] });
        }

        let serverVote = tagged.servers.find(
          (x: any) => x.serverID === (interaction.guild as any).id
        );
        if (!serverVote) {
          tagged.servers.push({
            serverID: (interaction.guild as any).id,
            MVs: 1,
            MOTWs: 1,
          });

          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }
          tagged.motw = tagged.motw + 1;
          tagged.modV = tagged.modV + 1;

          let embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: `👏Good Mod Spotted👏` })
            .setThumbnail("https://i.imgur.com/PPaVaRX.jpg")
            .setFooter({ text: `➤ ` + FOOTER })
            .setDescription(
              `${interaction.user} showed his appreciation for Mod ${memberz.user}!`
            );
          interaction.reply({ embeds: [embed] });

          tagged.save().catch((err: any) => console.log(err));
          await userData.save().catch((err: any) => console.log(err));

          return;
        } else {
          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }

          let embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: `👏Good Mod Spotted👏` })
            .setThumbnail("https://i.imgur.com/PPaVaRX.jpg")
            .setFooter({ text: `➤ ` + FOOTER })
            .setDescription(
              `${interaction.user} showed his appreciation for Mod ${memberz.user}!`
            );

          interaction.reply({ embeds: [embed] });

          tagged.motw = tagged.motw + 1;
          tagged.modV = tagged.modV + 1;
          // @ts-ignore
          serverVote.MVs = serverVote.MVs + 1;
          // @ts-ignore
          serverVote.MOTWs = serverVote.MOTWs + 1;

          tagged.save().catch((err: any) => console.log(err));
          await userData.save().catch((err: any) => console.log(err));

          //WEEKLY DATA SECTION========================
          let weeklyData = await UserWeeklyMissionsModel.findOne({
            id: interaction.user.id,
          }); //Author
          if (!weeklyData) {
            await UserWeeklyMissionsModel.create({
              id: interaction.user.id,
              mv: {
                value: 1,
                users: [`${memberz.id}`],
                prize: false,
                prizePlus: false,
              },
            });
          } else {
            let FindPerson1 = weeklyData.mv.users.indexOf(`${memberz.id}`);
            if (FindPerson1 == -1) {
              /*Success*/
              if (weeklyData.mv.value > 0) {
                weeklyData.mv.value += 1;
              } else {
                weeklyData.mv.value = 1;
              }
              weeklyData.mv.users.push(memberz.id);
              await weeklyData.save().catch((err: any) => console.log(err));
            } else {
              /*FAIL*/ weeklyData.mv.value += 1;
              await weeklyData.save().catch((err: any) => console.log(err));
            }
          }
          //WEEKLY DATA SECTION===================================================================

          return;
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
      const cooldownTime = 43200000;
      const PremiumcooldownTime = cooldownTime / 2;

      const memberz = interaction.options.getMember("user") as GuildMember;
      if (!memberz) {
        const userCooldown2 = userData.Biggercooldown.find(
          (x: any) => x.command === "demodvote"
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
                  )}** before you can pray for their downfall again🙏😔<a:exclamation:741988026296696872>`
                ),
            ],
          })
          .catch(console.error);
      }

      if (memberz.user.bot)
        return interaction.reply(
          "You didn't possibly just try to demote a bot😐"
        );

      if (
        !(
          memberz.permissions.has("BAN_MEMBERS") &&
          memberz.permissions.has("KICK_MEMBERS")
        )
      ) {
        return interaction.reply(
          "That person isn't a Moderator <a:LmaoBlast:741346535358595072>"
        );
      }

      if (memberz.id === interaction.user.id) {
        return interaction.reply("Okay Drama Queen, we get it.");
      }

      // @ts-ignore
      if (interaction.member.permissions.has("BAN_MEMBERS")) {
        return interaction.reply(
          "Don't do your comrade dirty! <:sus:715633189871419554>"
        );
      }

      const tagged = await MOTWModel.findOne({ userID: memberz.id });
      if (!tagged) {
        return interaction.reply(
          "Leave his 0 votes ass be. Nobody likes him anyways💀"
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
                  )}** before you can pray for their downfall again🙏😔<a:exclamation:741988026296696872>`
                ),
            ],
          })
          .catch(console.error);
      } else {
        let serverVote = tagged.servers.find(
          (x: any) => x.serverID === (interaction.guild as any).id
        );
        // @ts-ignore
        if (!serverVote || serverVote.MVs < 0) {
          return interaction.reply(
            "Leave his 0 votes ass be. Nobody likes him here anyways💀"
          );
        } else {
          if (userData.premium === true) {
            userCooldown2.endCooldown = Date.now() + PremiumcooldownTime;
          } else {
            userCooldown2.endCooldown = Date.now() + cooldownTime;
          }
          // @ts-ignore
          tagged.modV = tagged.modV - 1;
          // @ts-ignore
          serverVote.MVs = serverVote.MVs - 1;

          await userData.save().catch((err: any) => console.log(err));
          tagged.save().catch((err: any) => console.log(err));

          return interaction.reply(
            "`Successfully cleaned 1 vote of:`" +
              ` \`${memberz.user.tag}\`` +
              "<a:CleanWoman:728219543658561606>"
          );
        }
      }
    }
  }
}
