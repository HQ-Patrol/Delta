import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { GuildMember, Message, MessageEmbed, Permissions, TextChannel } from "discord.js";
import config from "../../../config";
import emoji from "../../../constants/emoji";
import ms from "ms";
import prettyMs from "pretty-ms";
import { error } from "../../../utilities/logger";

function permChecker(subcommand: string, clientMember: GuildMember, member: GuildMember, interaction: Command.ChatInputInteraction){
    if(["dm"].includes(subcommand)){
        // Manage Roles permission check.
        if(!clientMember.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: "Please provide the `MANAGE ROLES` permission to the bot.", ephemeral: true })
        if(!member.permissions.has("MANAGE_ROLES")) return interaction.reply(({ content: "You need the `MANAGE ROLES` permission to use this command.", ephemeral: true }))
    }

    else if(['forceban', 'unban'].includes(subcommand)){
        // Ban Members permission check.
        if(!clientMember.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "Please provide the `BAN MEMBERS` permission to the bot.", ephemeral: true })
        if(!member.permissions.has("BAN_MEMBERS")) return interaction.reply(({ content: "You need the `BAN MEMBERS` permission to use this command.", ephemeral: true }))
    }

    else if(['forcekick'].includes(subcommand)){
        // Kick Members permission check.
        if(!clientMember.permissions.has("KICK_MEMBERS")) return interaction.reply({ content: "Please provide the `KICK MEMBERS` permission to the bot.", ephemeral: true })
        if(!member.permissions.has("KICK_MEMBERS")) return interaction.reply(({ content: "You need the `KICK MEMBERS` permission to use this command.", ephemeral: true }))
    }

    else if(['slowmode', 'purge', 'mute', 'unmute'].includes(subcommand)){ // Added mute/unmute cuz there seems to be no option of timeout members perm.
        // Manage Messages permission check.
        if(!clientMember.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: "Please provide the `MANAGE MESSAGES` permission to the bot.", ephemeral: true })
        if(!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply(({ content: "You need the `MANAGE MESSAGES` permission to use this command.", ephemeral: true }))
    }
    else if(subcommand === "nick"){
        if(!clientMember.permissions.has("MANAGE_NICKNAMES")) return interaction.reply({ content: "Please provide the `MANAGE NICKNAMES` permission to the bot.", ephemeral: true })
        if(!member.permissions.has("MANAGE_NICKNAMES")) return interaction.reply(({ content: "You need the `MANAGE NICKNAMES` permission to use this command.", ephemeral: true }))

    }
}

@ApplyOptions<Command.Options>({
    name: "mod",
    description: "Moderator Commands"
})

export class ModCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand((subcommand) =>
            subcommand
                .setName("dm")
                .setDescription("DM a user")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to message")
                    .setRequired(true))
                .addStringOption(o => o
                    .setName("message")
                    .setDescription("The message to send the user")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("forceban")
                .setDescription("Quickly ban someone")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to ban")
                    .setRequired(true))
                .addStringOption(o => o
                    .setName("reason")
                    .setDescription("Reason for ban")
                    .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("forcekick")
                .setDescription("Quickly kick someone")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to kick")
                    .setRequired(true))
                .addStringOption(o => o
                    .setName("reason")
                    .setDescription("Reason for kick")
                    .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("mute")
                .setDescription("Mute someone")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to mute")
                    .setRequired(true))
                .addNumberOption(o => o
                    .setName("duration")
                    .setDescription("For how long? (e.g. 20m)")
                    .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("nick")
                .setDescription("Change someone's nickname")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to nickname")
                    .setRequired(true))
                .addStringOption(o => o
                    .setName("nickname")
                    .setDescription("What do we call them?")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("say")
                .setDescription("Say something!")
                .addStringOption(o => o
                    .setName("message")
                    .setDescription("What do you want to say?")
                    .setRequired(true))
                .addBooleanOption(o => o
                    .setName("embed")
                    .setDescription("Fancy an embed along with it?")
                    .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("slowmode")
                .setDescription("Set slowmode for a channel.")
                .addNumberOption(o => o
                    .setName("delay")
                    .setDescription("How long do users need to wait to send another message")
                    .setRequired(true))
                .addStringOption(o => o
                    .setName("reason")
                    .setDescription("Optional reason for this action.")
                    .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("unban")
                .setDescription("Unban someone")
                .addStringOption(o => o
                    .setName("user")
                    .setDescription("The user ID to unban")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("unmute")
                .setDescription("Unmute someone !")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to unmute")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("purge")
                .setDescription("Purge a number of messages!")
                .addNumberOption((option) =>
                option
                    .setName("messages")
                    .setDescription("Number of messages to delete.")
                    .setMaxValue(100)
                    .setMinValue(1)
                    .setRequired(true)
                )
                .addStringOption((option) =>
                option
                    .setName("match")
                    .setDescription("Delete messages containing the text")
                )
                .addUserOption((option) =>
                option
                    .setName("user")
                    .setDescription("User")
                )
                .addBooleanOption((option) =>
                option
                    .setName("bots")
                    .setDescription("Delete only messages of bots!")
                )
            )
        )
    }
    public async chatInputRun(interaction: Command.ChatInputInteraction){
        const subcommand = interaction.options.getSubcommand();
        const clientMember = interaction.guild!.members.cache.get(interaction.client.user!.id)!
        const member = (interaction.member) as GuildMember;

        // Perm Checking
        await permChecker(subcommand, clientMember, member, interaction);

        // Subcommand handling.
        if(subcommand === "dm"){
            if (!(config.verify.includes(interaction.user.id) || config.commanders.includes(interaction.user.id))) return interaction.reply({ content: "You don't have perms :(", ephemeral: true });

            await interaction.deferReply({ ephemeral: true });
            const user = interaction.options.getMember("user", true) as GuildMember;
            const msg = interaction.options.getString("message", true);

            try {
                await user.send({ content: msg })
                return interaction.editReply({ content: "Successfully DM'd user." })
            }
            catch {
                return interaction.editReply({ content: "Couldn't do it, probably closed DMs." })
            }
        }
        else if(subcommand === "forceban"){
            if (!(config.owner.includes(interaction.user.id))) return interaction.reply({ content: "You don't have perms :(", ephemeral: true });

            const user = interaction.options.getMember("user", true) as GuildMember;
            const reason = interaction.options.getString("reason", true);

            if (user.id === interaction.user.id) return interaction.reply({ content: "Stop seeking attention Jeez. You know you can't ban yourself" });
            if (!user.bannable) return interaction.reply({ content: "I can't possibly ban a God while being a peasant myself😫 Move me up in roles, maybe😏", ephemeral: true })

            await interaction.deferReply()

            try {
                await user.ban({ reason });
                return interaction.editReply({ content: `${emoji.cleanWoman} ${user.user.username} \`Just got wiped off the floor, let's hope to never see them again! \` ${emoji.cleanWoman}` })
            }
            catch {
                return interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
            }
        }
        else if(subcommand === "forcekick"){
            if (!(config.owner.includes(interaction.user.id))) return interaction.reply({ content: "You don't have perms :(", ephemeral: true });

            const user = interaction.options.getMember("user", true) as GuildMember;
            const reason = interaction.options.getString("reason", true);

            if (user.id === interaction.user.id) return interaction.reply({ content: "Stop seeking attention Jeez. You know you can't ban yourself" });
            if (!user.kickable) return interaction.reply({ content: "I can't possibly kick a God while being a peasant myself😫 Move me up in roles, maybe😏", ephemeral: true })

            await interaction.deferReply()

            try {
                await user.kick(reason);
                return interaction.editReply({ content: `⚡ \`${user.user.username} just got kicked out of the server!\` ⚡` })
            }
            catch {
                return interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
            }
        }
        else if(subcommand === "mute"){
            if (!(config.owner.includes(interaction.user.id))) return interaction.reply({ content: "You don't have perms :(", ephemeral: true });

            const user = interaction.options.getMember("user", true) as GuildMember;
            const time = ms(interaction.options.getString("duration") || "60s")

            if (user.id === interaction.user.id) return interaction.reply({ content: "I don't think this is a good idea..." });
            if (!user.manageable) return interaction.reply({ content: "Yeah that's not gonna work, check your perms.", ephemeral: true })

            await interaction.deferReply()

            try {
                await user.timeout(time)
                return interaction.editReply({ content: `${user} has now been muted for \`${prettyMs(time)}\`` })
            }
            catch {
                return interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
            }
        }
        else if(subcommand === "nick"){
            const user = interaction.options.getMember("user", true) as GuildMember;
            const nick = interaction.options.getString("nickname")

            await interaction.deferReply()

            try {
                await user.setNickname(nick)
                return interaction.editReply({ content: `Successfully changed **${user}**'s nickname to **${nick}**` })
            }
            catch {
                return interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
            }
        }
        else if(subcommand === "say"){
            const msg = interaction.options.getString("message", true)
            const embed = !!interaction.options.getBoolean("embed")

            const banned = ["discord.gg", "www.", ".com", "https://"]

            if(banned.some(e => msg.includes(e))){
                if(!(interaction.member as GuildMember).permissions.has("BAN_MEMBERS") && (!config.owner.includes(interaction.user.id))) {
                    return interaction.reply({ content: "__**Only Moderators of this Server**__ can make me add **LINKS** in the broadcasted message!", ephemeral: true })
                }
            }

            const roleColor = (interaction.member as GuildMember).displayHexColor === "#000000" ? "#ffffff" : (interaction.member as GuildMember).displayHexColor;

            if (embed){
                const embed = new MessageEmbed()
                    .setColor(roleColor)
                    .setDescription(msg)
                    .setTimestamp()
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

                return interaction.reply({ embeds: [embed] })
            }
            else {
                if (interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    return interaction.reply({ content: msg })
                } else {
                    return interaction.reply({ content: msg, allowedMentions: { parse: [] } })
                }
            }
        }
        else if(subcommand === "slowmode"){
            const channel = interaction.channel as TextChannel;
            const delay = interaction.options.getNumber("delay", true);
            const reason = interaction.options.getString("reason") || "";

            if (delay > 21600){
                return interaction.reply({ content: "You cannot set slowmode to more than 6 hours (21600 seconds)!" })
            }

            await interaction.deferReply({ ephemeral: true })

            try {
                await channel.setRateLimitPerUser(delay, reason);
                return interaction.editReply({ content: `Successfully set slowmode of ${delay}s for ${channel}!` })
            }
            catch (e){
                if (e instanceof Error){
                    await interaction.editReply({ content: "Failed to set slowmode!" })
                    error(e.message)
                }
            }
        }
        else if(subcommand === "unban"){
            const userId = interaction.options.getString("user", true)
            const user = await interaction.client.users.fetch(userId, { cache: true })
            if (!user) return interaction.reply({ content: "Couldn't find the member on the ban list.", ephemeral: true })

            await interaction.deferReply()

            try {
                await interaction.guild?.members.unban(user)
                return interaction.reply({ content: `${user.tag} has been unbanned and can be brought back to life🙌` })
            }
            catch {
                return interaction.reply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
            }
        }
        else if(subcommand === "unmute"){
            const user = interaction.options.getMember("user", true) as GuildMember

            await interaction.deferReply()

            try {
                await user.timeout(null)
                return interaction.reply({ content: `${user} has been UNMUTED!` })
            }
            catch {
                return interaction.reply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
            }
        }
        else if(subcommand === "purge"){
            const messageCount = interaction.options.getNumber('messages')!
            const match = interaction.options.getString("match")
            const bots = interaction.options.getBoolean("bots")
            const target = interaction.options.getMember("user") as GuildMember;
            const channel =  interaction.channel as TextChannel;

            await interaction.deferReply({ ephemeral: true });
            let messages = await interaction.channel!.messages.fetch({ limit: 100 })
            if(match){
                messages = messages.filter(m => m.content.toLowerCase().includes(match.toLowerCase()) && !m.pinned )
            }
            if(bots){
                messages = messages.filter(m => m.author.bot && !m.pinned )

            }
            if(target){
                messages = messages.filter(m => m.author.id === target.id && !m.pinned )

            }
            //console.log(messages)
            channel.bulkDelete(messages.first(messageCount), true).then((msgs) => msgs.size !== 0 ? channel.send(`Gone! \`${msgs.size} messages\` reduced to atoms🔥`) : channel.send("Found nothing to delete :/"))
                .then((m: Message) => setTimeout(() => m.delete(), 5000))

            return interaction.editReply({ content: "Task completed." })
        }

    }
}