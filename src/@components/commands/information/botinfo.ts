import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "botinfo",
    description: "Shows all informations related to the bot!"
})

export class BotInfoClass extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }

    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        // Bot Info command
        const guildNum = interaction.client.guilds.cache.size;
        const userNum = interaction.client.users.cache.size;

        const embed = new MessageEmbed()
            .setThumbnail("https://i.imgur.com/BMJpQiX.gif") // Erica
            .setTitle('🤖 Bot Stats 🤖')
            .setColor("BLUE")
            .addFields(
                {
                    name: '🌐 Servers',
                    value: `Serving ${guildNum} servers.`,
                    inline: true
                },
                {
                    name: '👥 Server Users',
                    value: `Serving ${userNum} users.`,
                    inline: true
                },
                {
                    name: 'President 👔',
                    value: `Sinless#0001`,
                    inline: true
                },
                {
                    name: '⏳ Ping',
                    value: `${Math.round(interaction.client.ws.ping)}ms`,
                    inline: true
                },
                {
                    name: '📆 Join Date',
                    value: interaction.client.user!.createdAt.toUTCString(),
                    inline: true
                },
                {
                    name: '🤓 Contributors',
                    value: "Zihad#5252🐐\nleo.#0005🦁\nRageous#7834💲\nDebelox#7000😈 & more...",
                    inline: true
                }
            )
            .addFields([
                {
                    name: "<a:CleanWoman:728219543658561606> Invite this Bot",
                    value: "[Click Here](https://discord.com/api/oauth2/authorize?client_id=763506280421392466&permissions=8&scope=bot)",
                    inline: true
                },
                {
                    name: "<a:PatrolBot:736282237225533571> Website",
                    value: "[Click here to Visit](https://patrolbot.xyz)",
                    inline: true
                },
                {
                    name: "<:DiscordLogo:730154954492477482> Discord",
                    value: "[Join Server](https://discord.gg/HQ)",
                    inline: true
                }

            ])
            .setFooter({ text: `ID: 711628700747300864 • PFP by: ？？？#0013`, iconURL: `https://i.imgur.com/YTMhQOx.gif` })
            .setTimestamp(interaction.createdTimestamp)

        await interaction.reply({ embeds: [embed] })
    }
}