import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "serverinfo",
    description: "Shows important information about your server!"
})

export class ServerInfoCommand extends Command{
    public registerApplicationCommands(registry: ChatInputCommand.Registry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        // Server Info command
        await interaction.deferReply();

        const banCount = (await interaction.guild!.bans.fetch()).size
        const channels = interaction.guild!.channels.cache.filter(c => c.type === "GUILD_TEXT" || c.type === "GUILD_VOICE");

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(interaction.guild!.iconURL({ dynamic: true }) ?? "")
            .setDescription(`**Guild information for __${interaction.guild!.name}__**`)
            .addFields(
                {
                    name: "<:DiscordLogo:730154954492477482> Server ID: ",
                    value: `${interaction.guild!.id}`,
                    inline: true
                },
                {
                    name: "👑 Owner: ",
                    value: `<@${interaction.guild!.ownerId}>`,
                    inline: true
                },
                {
                    name: "👥 Members: ",
                    value: `${interaction.guild!.memberCount} users`,
                    inline: true
                },
                {
                    name: "Members Online: ",
                    value: `<:online:730144283520270417> ${interaction.guild!.members.cache.filter(m => m.presence?.status == "online").size} users online!`,
                    inline: true
                },
                {
                    name: "🤖 Total Bots: ",
                    value: `${interaction.guild!.members.cache.filter(m => m.user.bot).size}` || "0",
                    inline: true
                })
            .addFields([{
                name: 'Channels',
                value: `**❯ <:channel:730152700213198848> Text:** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size} 〰 **<:voicechannel:730152700049621024> Voice:** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size} 	**❮**`,
    }])
            .addFields(
                {
                    name: "😎 Roles: ",
                    value: `${interaction.guild!.roles.cache.size}` || "0",
                    inline: true,
                },
                {
                    name: '<:boost:730152703010930829> Boosters: ',
                    value: interaction.guild!.premiumSubscriptionCount! >= 1 ? `${interaction.guild!.premiumSubscriptionCount} Boosters` : `Boo, nobody Boosted😭`,
                    inline: true
                },
                {
                    name: "🤪 Emojis: ",
                    value: interaction.guild!.emojis.cache.size >= 1 ? `${interaction.guild!.emojis.cache.size}` : 'None',
                    inline: true
                }
            )
            .addFields([{
                name: `<:ban:730152700209266739> Ban Count: `,
                value: banCount.toString()
            }])
            .setFooter({ text: `Created: ${interaction.guild!.createdAt.toUTCString()}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

        await interaction.editReply({ embeds: [embed] })
    }
}