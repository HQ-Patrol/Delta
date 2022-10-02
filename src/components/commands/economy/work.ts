import ms from "ms";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import Discord, { MessageActionRow, MessageEmbed } from "discord.js";
import { randomFromArray } from '../../../utilities/query/pets';

const inWorkMenu = new Map<string, string>();
const jobs = {
    "Artist": {
        name: "Artist",
        cooldown: ms("1m"), // 1 minute
        embedDescription: [
            "You worked as an artist and earned a measly **{earn} coins** <:PaintBrush:776128044518998046>"
        ],
        earn: [50, 100], // min - max
        xp: 1,
        thumbnail: "https://i.imgur.com/quXG9xj.gif"
    },
    "Internet Troll": {
        name: "Internet Troll",
        cooldown: ms("5m"),
        embedDescription: [
            "You worked as an Internet Troll and made a commission of **{earn} coins** <a:Troll_Smile:858755953956880396>"
        ],
        earn: [100, 150],
        premiumOnly: true,
        xp: 2,
        thumbnail: "https://i.imgur.com/xao8TKk.gif"
    },
    "Discord Moderator": {
        name: "Discord Moderator",
        level: 5,
        cooldown: ms("30m"),
        embedDescription: [
            "You worked as a Moderator for a sus Discord Server & made roughly **{earn} coins** <:GotThat:842141052752363543>"
        ],
        earn: [175, 300],
        xp: 3,
        thumbnail: "https://i.imgur.com/clsTIrB.gif"
    },
    "Plumber": {
        name: "Plumber",
        level: 10,
        cooldown: ms("60m"),
        embedDescription: [
            "You worked as a plumber and only earned **{earn} coins** <a:MarioPlumber:776133492273709066>"
        ],
        earn: [200, 400],
        xp: 5,
        mission: {
            weekly: "work_Plumber",
            monthly: "work_Plumber",
        },
        thumbnail: "https://i.imgur.com/pEyAieQ.gif"
    },
    "Chef": {
        name: "Chef",
        level: 15,
        cooldown: ms("3h"),
        embedDescription: [
            "You worked as a Chef and cooked a nice chunk of **{earn} coins** <:chefskiss:858757858900181044>"
        ],
        earn: [400, 500],
        xp: 10,
        mission: {
            weekly: "work_Chef"
        },
        thumbnail: "https://i.imgur.com/Q2rKdIp.gif"
    },
    "Tech Support Scammer": {
        name: "Tech Support Scammer",
        level: 20,
        cooldown: ms("6h"),
        embedDescription: [
            "You worked as a Tech Support Scammer and stole **{earn} coins** from the elderly couple <:LinusTech:763254399970836499>"
        ],
        earn: [500, 800],
        premiumOnly: true,
        xp: 15,
        mission: {
            monthly: "work_TechSupport"
        },
        thumbnail: "https://i.imgur.com/52LAHiE.gif"
    },
    "Gold Digger": {
        name: "Gold Digger",
        cooldown: ms("10h"),
        embedDescription: [
            "You did what a Gold Digger does and earned **{earn} coins** in the process <a:WavingSomeCash:822490680031051807>"
        ],
        earn: [1, 1000],
        premiumOnly: true,
        xp: 25,
        mission: {
            weekly: "work_GoldDigger",
            monthly: "work_GoldDigger"
        },
        thumbnail: "https://i.imgur.com/QHEkUlA.gif"
    },
    "Teacher": {
        name: "Teacher",
        level: 30,
        cooldown: ms("15h"),
        embedDescription: [
            "You worked as a teacher and earned about **{earn} coins** 👩‍🏫"
        ],
        earn: [750, 1000],
        xp: 40,
        mission: {
            weekly: "work_Teacher",
            monthly: "work_Teacher"
        },
        thumbnail: "https://i.imgur.com/t8YjIOZ.gif"
    },
    "Rapper": {
        name: "Rapper",
        level: 35,
        cooldown: ms("1d"),
        embedDescription: [
            "You worked as an MC and made a whopping **{earn} coins** <a:KirbyGorge:732213117131554859>"
        ],
        earn: [1000, 1200],
        xp: 50,
        thumbnail: "https://i.imgur.com/3HwQZDB.gif"
    },
    "Hacker": {
        name: "Hacker",
        level: 40,
        cooldown: ms("1.5d"),
        embedDescription: [
            "You worked as a hacker which earned you poggers **{earn} coins** <a:Hacker:776136369478565898>"
        ],
        earn: [1200, 1800],
        xp: 75,
        thumbnail: "https://i.imgur.com/K2b4duf.gif"
    },
    "Influencer": {
        name: "Influencer",
        premiumOnly: true,
        level: 45,
        cooldown: ms("2d"),
        embedDescription: [
            "You enjoyed making crappy content as an influencer and got sponsored for **{earn} coins** <a:GlobalRepLBTopper:857216661068972042>"
        ],
        earn: [1000, 2500],
        xp: 100,
        thumbnail: "https://i.imgur.com/VOJuq31.gif"
    },
    "Stripper": {
        name: "Stripper",
        level: 50,
        cooldown: ms("3d"),
        embedDescription: [
            "You worked as a stripper and earned a staggering **{earn} coins** <a:ThanosDance:763468378794754049>"
        ],
        earn: [1000, 5000],
        xp: 250,
        thumbnail: "https://i.imgur.com/ZJtZ855.gif"
    },
};

@ApplyOptions<Command.Options>({
    name: "work",
    description: "Work and earn money!"
})

export class WorkCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
            registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addSubcommand(option =>
                option
                    .setName("list")
                    .setDescription("List all the jobs !")
                )
                .addSubcommand(option =>
                option
                    .setName("choose")
                    .setDescription("Choose your job!")
                    .addStringOption(option =>
                    option
                        .setName("work")
                        .setDescription("Choose your job!")
                        .setRequired(true)
                        .addChoices(
                            {
                                name: "artist",
                                value: "artist"
                            },
                            {
                                name: "internet-troll",
                                value: "internetTroll"
                            },
                            {
                                name: "discord-moderator",
                                value: "discordModerator"
                            },
                            {
                                name: "plumber",
                                value: "plumber"
                            },
                            {
                                name: "chef",
                                value: "chef",
                            },
                            {
                                name: "tech-support-scammer",
                                value: "techSupportScammer"
                            },
                            {
                                name: "gold-digger",
                                value: "goldDigger"
                            },
                            {
                                name: "teacher",
                                value: "teacher"
                            },
                            {
                                name: "rapper",
                                value: "rapper"
                            },
                            {
                                name: "hacker",
                                value: "hacker"
                            },
                            {
                                name: "influencer",
                                value: "influencer"
                            },
                            {
                                name: "stripper",
                                value: "stripper"
                            }
                        )
                    )
                )
            )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        const subCommand = interaction.options.getSubcommand();
        const footers = ["!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "!ᴠᴏᴛᴇ ꜰᴏʀ 🎁", "ꜱᴜʙᴍɪᴛ ʏᴏᴜʀ ᴏᴡɴ !ᴛᴏᴘɪᴄꜱ", "ᴠɪꜱɪᴛ ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ ✨", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ!", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ᴘʀᴇᴍɪᴜᴍ ꜰᴏʀ 🌟", "!ꜱꜰᴡ ᴏɴ ʀᴇᴍᴏᴠᴇs ᴛʜᴇ 🔞", "!ᴛᴄᴍᴅ ᴅɪsᴀʙʟᴇꜱ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ", "!ᴄʜɪʙɪ ᴛᴏ ʀᴇᴅᴜᴄᴇ ɢɪꜰ ꜱɪᴢᴇ", "ᴛʜᴇʀᴇ'ꜱ ᴇᴀꜱᴛᴇʀ ᴇɢɢꜱ ᴛᴏᴏ?!🤐", "!ʜᴇʟᴘ <ᴄᴍᴅ> ɪꜱ ʜᴇʟᴘꜰᴜʟ", "!50-50 ᴛᴏ ꜱᴇᴇ ɢᴏʀᴇ ☠", "!ᴜᴘᴅᴀᴛᴇꜱ ꜰᴏʀ ɴᴇᴡ ɪɴꜰᴏ", "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)", "!ɪɴᴠɪᴛᴇ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀꜱ :)", "'!ʀᴇᴘꜱ ɪɴꜰᴏ' ꜰᴏʀ ᴇxᴛʀᴀ 📚🤓", "ʏᴏᴜ ʟᴏꜱᴇ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛᴀxᴇꜱ ᴇᴠᴇʀʏᴅᴀʏ!", "ʀᴇᴘᴏʀᴛ ᴀɴʏ ʙᴜɢ ʙʏ !ʙᴜɢʀᴇᴘᴏʀᴛ ꜰᴏʀ 🍪", "ᴘʀᴇᴍɪᴜᴍ ɪꜱ ᴊᴜꜱᴛ $3.99/ᴍᴏɴᴛʜ🌟(ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ)", "ᴄᴏᴅᴇ: 'ʟᴇᴛꜱɢᴏ' ꜰᴏʀ 10% ᴏꜰꜰ (ᴘᴀᴛʀᴏʟʙᴏᴛ.xʏᴢ/ꜱᴛᴏʀᴇ) 💲", "ᴏᴘᴇɴ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ᴛᴏ ʟᴇᴠᴇʟ ᴜᴘ ꜰᴀꜱᴛ!", "!ʙᴏᴏꜱᴛᴇʀs ᴛᴏ ᴇᴀʀɴ ᴀ ᴅᴀɪʟʏ ᴍʏꜱᴛᴇʀʏ ʙᴏx & ᴄᴏɪɴꜱ 😋", "ᴛʏᴘᴇ: !ᴄᴍᴅꜱ ᴛᴏ ɢᴇᴛ ʟɪꜱᴛ ᴏꜰ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ 🤩", "'!ᴛᴄᴍᴅ ʀᴏʙ' ᴛᴏ ᴅɪꜱᴀʙʟᴇ ᴀʟʟ ʀᴏʙʙɪɴɢ ɪɴ ʏᴏᴜʀ ꜱᴇʀᴠᴇʀ 🚔", "!ꜱᴇᴛᴄʀᴜᴄɪꜰʏ ᴛᴏ ᴄʜᴀɴɢᴇ ᴄʀᴜᴄɪꜰʏ ʟɪᴍɪᴛ", "Always do !ᴛᴀꜱᴋ ɪɴꜰᴏ <ᴄᴏᴅᴇ> more starting a mission!", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ᴇᴀʀɴ ᴛᴏɴꜱ ᴏꜰ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ ꜰᴏʀ ꜰʀᴇᴇ ʙʏ ᴅᴏɪɴɢ !tasks 📜", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "ꜰᴜɴ ꜰᴀᴄᴛ: ʏᴏᴜ ᴄᴀɴ ᴡɪɴ ꜰʀᴇᴇ ᴅɪꜱᴄᴏʀᴅ ɴɪᴛʀᴏ ꜰʀᴏᴍ !ꜱʜᴏᴘ 🎁", "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ", "!ᴛᴀx ᴜᴘɢʀᴀᴅᴇ ᴄᴀɴ ɪɴᴄʀᴇᴀꜱᴇ ʙᴀɴᴋ ꜱᴘᴀᴄᴇ ʙʏ ᴍɪʟʟɪᴏɴꜱ", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ᴊᴏɪɴ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠᴇʀ ꜰᴏʀ ꜰʀᴇᴇ ᴄᴏɪɴꜱ: ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ʜQ 💰", "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏", "ʙᴜʏ ɢᴀᴍʙʟɪɴɢ ᴄᴀʀᴅ ᴛᴏ ʀᴇᴄᴏʀᴅ ᴀʟʟ ʏᴏᴜʀ ᴡɪɴ-ʟᴏꜱꜱᴇꜱ 🃏", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴠɪꜱɪᴛ !ꜱᴛᴏʀᴇ ᴛᴏ ᴘᴜʀᴄʜᴀꜱᴇ ᴍʏꜱᴛᴇʀʏ ʙᴏxᴇꜱ 🎁", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "ᴄᴏᴅᴇ 'ꜰɪʀꜱᴛ' ꜰᴏʀ 15% ᴏꜰꜰ 1ꜱᴛ !ꜱᴛᴏʀᴇ ᴘᴜʀᴄʜᴀꜱᴇ! 🛍️", "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞", "!ɪɴᴠɪᴛᴇ ᴛᴏ ᴀᴅᴅ ꜰᴜɴ ɴꜱꜰᴡ ᴄᴏᴍᴍᴀɴᴅꜱ 🔞", "ꜰɪɴᴅ ᴇɢɢꜱ ᴛᴏ ʜᴀᴛᴄʜ ᴄᴏᴏʟ ᴘᴇᴛꜱ 🥚", "!ᴠᴏᴛᴇ ᴄᴀɴ ɴᴏᴡ ɢɪᴠᴇ ʏᴏᴜ ᴇɢɢꜱ 🥚", "ᴘᴇᴛ ʜᴇʟᴘ ʏᴏᴜ ᴡɪᴛʜ ᴛʜᴇɪʀ ᴜɴɪQᴜᴇ ꜱᴋɪʟʟꜱ ᴏʀ ᴛᴏ ʙᴀᴛᴛʟᴇ ᴏᴛʜᴇʀ ᴜꜱᴇʀꜱ!", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ʏᴏᴜ ɴᴇᴇᴅ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ᴛᴏ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ!", "ᴏɴʟʏ ᴡᴀʏ ᴛᴏ ᴏʙᴛᴀɪɴ ᴀ ɢʀᴏᴡᴛʜ ꜱᴇʀᴜᴍ ɪꜱ ʙʏ ᴜꜱɪɴɢ x25 ɢʀᴏᴡᴛʜ ᴠɪᴀʟꜱ!", "7 ᴅʀᴀɢᴏɴ ʙᴀʟʟꜱ ᴀʀᴇ ʀᴀʀᴇꜱᴛ ᴋɴᴏᴡɴ ɪᴛᴇᴍꜱ ᴡʜɪᴄʜ ᴄᴏᴜʟᴅ ɢʀᴀɴᴛ ᴜꜱᴇʀ'ꜱ ᴀɴʏ ᴡɪꜱʜ!", "ᴘᴜᴛ ʏᴏᴜʀ ᴘᴇᴛ ᴜᴘ ꜰᴏʀ ꜱᴀʟᴇ ᴏʀ ʙᴜʏ ᴏɴᴇ ᴜꜱɪɴɢ !ᴘᴇᴛ-ꜱᴀʟᴇ ᴄᴏᴍᴍᴀɴᴅ!", "ᴛʏᴘᴇ: !ʜᴇʟᴘ <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎", "ᴛʏᴘᴇ: !ʜᴇʟᴘ <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎", "ᴛʏᴘᴇ: !ʜᴇʟᴘ <ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ> ᴛᴏ ᴋɴᴏᴡ ᴍᴏʀᴇ ᴀʙᴏᴜᴛ ᴀɴʏ ᴄᴏᴍᴍᴀɴᴅ 🔎", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ᴛʏᴘᴇ: !ᴘᴇᴛ ᴛᴏ ᴘʟᴀʏ, ᴛʀᴀɪɴ ᴀɴᴅ ᴇᴠᴏʟᴠᴇ ʏᴏᴜʀ ᴘᴇᴛ 🦴", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ", "ᴛʏᴘᴇ: !ʜᴏᴡ-ᴛᴏ ᴇɢɢꜱ ᴛᴏ ᴋɴᴏᴡ ʜᴏᴡ ᴛᴏ ᴏʙᴛᴀɪɴ ᴇɢɢꜱ/ᴘᴇᴛꜱ", "Type: !info item/badge/pet <Name> to know more 🔎", "Type: !info item/badge/pet <Name> to know more 🔎", "ᴡʜᴇɴ ʏᴏᴜ ᴅɪᴠᴏʀᴄᴇ ꜱᴏᴍᴇᴏɴᴇ, ɪᴛ ɢɪᴠᴇꜱ 50% ᴏꜰ ʏᴏᴜʀ ᴡᴇᴀʟᴛʜ ᴛᴏ ᴛʜᴇ ᴇꜱᴛʀᴀɴɢᴇᴅ ꜱᴘᴏᴜꜱᴇ!", "ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛᴏ ᴅᴏ ᴀ ᴘʀᴇɴᴜᴘ ᴡʜᴇɴ ᴍᴀʀʀʏɪɴɢ ꜱᴏᴍᴇᴏɴᴇ ᴛᴏ ᴀᴠᴏɪᴅ ʟᴏꜱɪɴɢ ᴅɪᴠᴏʀᴄᴇ ᴍᴏɴᴇʏ 🤞"];
        const _footer = "➤ " + randomFromArray(footers)

       if(subCommand === "list"){
           let page: number = 1;
           const components = new MessageActionRow()
               .addComponents(
                   new Discord.MessageButton()
                       .setCustomId("mostleft")
                       .setEmoji("⏪")
                       .setStyle("PRIMARY")
                       .setDisabled((page == 1)),
                   new Discord.MessageButton()
                       .setCustomId("left")
                       .setEmoji("◀")
                       .setStyle("PRIMARY")
                       .setDisabled((page == 1)),
                   new Discord.MessageButton()
                       .setCustomId("right")
                       .setEmoji("▶")
                       .setStyle("PRIMARY")
                       .setDisabled((page == 2)),
                   new Discord.MessageButton()
                       .setCustomId("mostright")
                       .setEmoji("⏩")
                       .setStyle("PRIMARY")
                       .setDisabled((page === 2))
               );

           const embed = new MessageEmbed()
               .setAuthor({ name: `𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐉𝐨𝐛𝐬 [PAGE: ${page}/2]`, iconURL: interaction.user.displayAvatarURL() })
               .setThumbnail("https://i.imgur.com/y2v3NW5.gif")
               .setColor("BLUE")
               .setFooter({ text: _footer });

           embed


           const collector = await interaction.reply({  })
       }
       else if(subCommand === "choose"){
           if(inWorkMenu.get(interaction.user.id) != undefined) {
               return interaction
                   .reply({
                       embeds: [
                           new MessageEmbed()
                               .setDescription(
                                   `You already have a work menu open! Close it to make another one.\n\n[Click [here](${inWorkMenu.get(interaction.user.id)} "Click Me!") to jump to the menu]`
                               )
                               .setColor("RED"),
                       ],
                   });
           }
       }



    }
}
