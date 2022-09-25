import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import config from '../../../config';
import { stripIndents } from 'common-tags';

@ApplyOptions<Command.Options>({
    name: "whois",
    description: "To find out information about a user"
})

export class WhoisCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User")
                .setRequired(true)
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        const member = interaction.options.getMember("user") as GuildMember;

        const msg = await interaction.reply({ content: "<a:FindingNukes:728258193565810778> Going through your incognito browser history <a:FindingNukes:728258193565810778>", fetchReply: true }) as Message

        let ack;
        if(member.id===interaction.guild!.ownerId) { ack = "👑 Server Owner 👑"}
        else if(member.permissions.has("ADMINISTRATOR")) {ack = "Administrator";}
        else if(member.permissions.has("MANAGE_ROLES")) { ack = "Roles Manager"}
        else if(member.permissions.has("MANAGE_GUILD") && member.permissions.has("MANAGE_CHANNELS")) { ack = "Server Manager"}
        else if(member.permissions.has("MANAGE_GUILD")) { ack = "Server Manager"}
        else if(member.permissions.has("MANAGE_CHANNELS")) { ack = "Channel Manager"}
        else if(member.permissions.has("MANAGE_MESSAGES")) { ack= "TOS Enforcer"}
        else if(member.permissions.has("KICK_MEMBERS")) { ack= "Mini Mods🥶"}
        // eslint-disable-next-line no-dupe-else-if
        else if(member.permissions.has("BAN_MEMBERS") && member.permissions.has("KICK_MEMBERS") && member.permissions.has("MANAGE_MESSAGES")) { ack = "Moderator"}
        else if(member.permissions.has("MUTE_MEMBERS") && member.permissions.has("DEAFEN_MEMBERS")) { ack = "VC Moderator"}
        else { ack = "Member"}

        let crack;
        if(config.owner.includes(member.user.id)) { crack = "& Bot Owner 👑"}
        else if(config.commanders.includes(member.user.id)) { crack = "& Bot Commander 😈"}
        // Uncomment when members are added in treasurers.
       // else if(config.treasurers.includes(member.user.id)) { crack = "& Bot Treasurer 🤑"}
        else if(config.babysitters.includes(member.user.id)) { crack = "& Bot Babysitter 👶"}
        else { crack = " "}

        let perms ;  // Check this
        if(member.id===interaction.guild!.ownerId) perms = `**Ownership** ~`;
        if(member.permissions.has("ADMINISTRATOR")) perms += ` Administrator ~`;
        if(member.permissions.has("KICK_MEMBERS")) perms += ` Kick Members ~`;
        if(member.permissions.has("BAN_MEMBERS")) perms += ` Ban Members ~`;
        if(member.permissions.has("MANAGE_CHANNELS")) perms += ` Manage Channels ~`;
        if(member.permissions.has("MANAGE_GUILD")) perms += ` Manage Server ~`;
        if(member.permissions.has("VIEW_AUDIT_LOG")) perms += ` Audit Logs ~`;
        if(member.permissions.has("PRIORITY_SPEAKER")) perms += ` Priority Speaker ~`;
        if(member.permissions.has("MANAGE_MESSAGES")) perms += ` Manage Messages ~`;
        if(member.permissions.has("MENTION_EVERYONE")) perms += ` Mention Everyone ~`;
        if(member.permissions.has("MUTE_MEMBERS")) perms += ` Mute Members ~`;
        if(member.permissions.has("DEAFEN_MEMBERS")) perms += ` Deafen Members ~`;
        if(member.permissions.has("MOVE_MEMBERS")) perms += ` Move Members ~`;
        if(member.permissions.has("MANAGE_NICKNAMES")) perms += ` Manage Nicknames ~`;
        if(member.permissions.has("MANAGE_ROLES")) perms += ` Manage Roles ~`;
        if(member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) perms += ` Manage Emojis ~`;
        if(member.permissions.has("MANAGE_WEBHOOKS")) perms += ` Manage Webhooks ~`;
        if(member.permissions.has("MANAGE_WEBHOOKS")) perms += ` Manage Webhooks ~`;
        if(member.permissions.has("SEND_MESSAGES")) perms += ` Send Messages~`;

        // if(member.presence.status === "offline") member.presence.status = "Offline <:offline:730144283692105779>"
        // if(member.presence.status === "dnd") member.presence.status = "Do Not Disturb 📵"
        // if(member.presence.status === "online") member.presence.status = "Online <:online:730144283520270417>"
        // if(member.presence.status === "idle") member.presence.status = "Idle 🌙"

        //Join Position Code :
        const sortedmembers = [...interaction.guild!.members.cache.values()].sort((a, b) =>
            ((Number(a.joinedAt)) - (Number(b.joinedAt)))
        )
        let position = sortedmembers.indexOf(member) + 1;

        if(member.user.id === "179911663586246656" || member.user.id === "179911663586246656") position = 1;

        const joined = member.joinedAt!.toUTCString();


        let highest;
        if(member.roles.highest.id === interaction.guild!.id) { highest = "None"}
        else { highest = member.roles.highest }

        // User Variable
        const created = member.user.createdAt.toUTCString();

        const roleColor = (interaction.member as GuildMember)!.displayHexColor === "#000000" ? "#ffffff" : (interaction.member as GuildMember).displayHexColor;
        const embed = new MessageEmbed()
            .setAuthor({ name: `User Information Panel`, iconURL: member.guild.iconURL()! })
            .setTitle(`${member.user.tag}`)
            .setFooter({ text: `ID: ${member.user.id}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(roleColor)
            .addFields(
                {
                    name: "Nickname:",
                    value: stripIndents`${member.user}`,
                    inline: true
                },
                {
                    name: "Join Position:",
                    value: stripIndents`**${position}**`,
                    inline: true
                },
                {
                    name: "Highest Role:",
                    value: stripIndents`${highest}`,
                    inline: true
                },
                {
                    name: "Joined at:",
                    value: stripIndents`${joined}`,
                    inline: true
                },
                {
                    name: "Created at:",
                    value: stripIndents`${created}`,
                    inline: true
                },
                {
                    name: "__Permissions__:",
                    value: stripIndents`${perms}`
                },
                {
                    name: "__Acknowledgement__:",
                    value: `\`\`\`${ack} ${crack}\`\`\``
                }

            )
            .setTimestamp(msg.createdTimestamp);

        // Uncomment when the Privileged Member Intent is granted !
        /*if(member.presence?.activities!.length! > 0) {
            embed.addFields({
                name: 'Currently Playing',
                value: `${member.presence?.activities.map(a=>a.name)}`
            })
        }*/

        msg.channel.send({ embeds: [embed] });
        return msg.delete();
    }
}