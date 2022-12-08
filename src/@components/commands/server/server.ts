import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ColorResolvable, EmbedFieldData, GuildMember, MessageEmbed, Role } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "server",
    description: "Commands for servers."
})

export class ServerCommands extends Command{
    public registerApplicationCommands(registry: ChatInputCommand.Registry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand((subcommand) =>
            subcommand
                .setName("bancount")
                .setDescription("See the total number of bans in your server😴")
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("icon")
                .setDescription("Get the server's icon")
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("membercount")
                .setDescription("See the total number of members in your server😴")
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("rolecolor")
                .setDescription("Change the color of any existing role")
                .addStringOption((option) =>
                option
                    .setName("color")
                    .setDescription("Role Color")
                    .setRequired(true)
                )
                .addRoleOption((option) =>
                option
                    .setName("role")
                    .setDescription("Role")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("roleinfo")
                .setDescription("Get info on any existing role")
                .addRoleOption((option) =>
                option
                    .setName("role")
                    .setDescription("Role")
                    .setRequired(true)
                )
            )
        )
    }

    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        // Defer the interaction
        await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();

        // Process all the subcommands.
        if(subcommand === "bancount"){
            // Bancount subcommand

            const bans = await interaction.guild!.bans.fetch(); // Fetch the bans
            const embed = new MessageEmbed()
                .setTitle("<:ban:730152700209266739> Ban Count")
                .setColor("BLUE")
                .setDescription(`Total Bans : ${bans.size} `)
                .setTimestamp(interaction.createdTimestamp);

            await interaction.editReply({ embeds: [embed] });
        }

        else if(subcommand === "icon"){
            // Get Icon sub-command
            const icon = interaction.guild!.iconURL({ dynamic: true }) ?? undefined;
            if(!icon) return interaction.editReply({ content: "This server has no icon!" });

            const embed = new MessageEmbed()
                .setTitle(`${interaction.guild!.name}'s Icon!`)
                .setImage(icon)
                .setColor("BLUE")
                .setFooter({ text: `Join our Support Server: https://discord.gg/HQ 🪄`, iconURL: interaction.client.user!.displayAvatarURL({ dynamic: true }) })

            await interaction.editReply({ embeds: [embed] });
        }
        else if(subcommand === "membercount"){

            const embed = new MessageEmbed()
                .setTitle(`👥 Members Count`)
                .setColor("BLUE")
                .setDescription(`${interaction.guild!.memberCount} users`)
                .setTimestamp(interaction.createdTimestamp);

            await interaction.editReply({ embeds: [embed] })
        }
        else if(subcommand === "rolecolor"){
            if(!(interaction.member as GuildMember).permissions.has("MANAGE_ROLES")) return interaction.editReply({ content: "You need to have MANAGE_ROLES permission to use this command." })

            const role = interaction.options.getRole('role') as Role;
            const color = interaction.options.getString("color")! ;

            if(!color.startsWith("#")) return interaction.editReply({ content: "Please submit a valid hex-code!" })

            try{
                await role.setColor((color as ColorResolvable))
                return interaction.editReply({ content: "Done! If the color was reset, you provided an invalid hex code." })
            }
            catch{
                return interaction.editReply({ content: "Choose a hex code with a hashtag, and make sure I have sufficient permissions." })
            }
        }
        else if(subcommand === "roleinfo"){
            const role = interaction.options.getRole("role")! as Role;
            const data = [
                {
                    name: "ID",
                    value: `\` ${role.id} \``,
                    inline: true
                },
                {
                    name: "Name",
                    value: `\` ${role.name} \``,
                    inline: true
                },
                {
                    name: "Color",
                    value: `${role.hexColor === '#000000' ? 'None' : `\`${role.hexColor}\``}`,
                    inline: true
                },
                {
                    name: "Mention",
                    value: `${role.toString()}`,
                    inline: true
                },
                {
                    name: "Hoisted",
                    value: role.hoist ? 'Yes' : 'No',
                    inline: true
                },
                {
                    name: "Position",
                    value: role.position.toString(),
                    inline: true
                },
                {
                    name: "Mentionable",
                    value: role.mentionable ? 'Yes' : 'No',
                    inline: true
                },
            ] as EmbedFieldData[]
            const embed = new MessageEmbed()
                .addFields(data)
                .setColor(role.hexColor)
                .setTimestamp(role.createdTimestamp)
                .setFooter({ text: "Role Created" })

            return await interaction.editReply({ embeds: [embed] });
        }


    }
}