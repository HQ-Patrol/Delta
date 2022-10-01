import ms from "ms";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";

const inWorkMenu = {};
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
            )
    }
}