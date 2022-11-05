
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry,  Command } from "@sapphire/framework";
import { GuildMember, HexColorString, MessageEmbed, Permissions } from "discord.js";
import { error } from "../../../utilities/logger";
import config from "../../../config";
import emoji from "../../../constants/emoji";


@ApplyOptions<Command.Options>({
    name: "admin",
    description: "Admin Commands",
    requiredClientPermissions: "MANAGE_ROLES"
})

export class AdminClass extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
            .addSubcommand((subcommand) =>
            subcommand
                .setName("addrole")
                .setDescription("Add role !")
                .addStringOption((option) =>
                option
                    .setName("name")
                    .setDescription("Role Name")
                    .setRequired(true)
                )
                .addStringOption((option) =>
                option
                    .setName("color")
                    .setDescription("Hex color of your new role (#123456)")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("delrole")
                .setDescription("Delete a specified role.")
                .addRoleOption(option => option
                    .setName("role")
                    .setDescription("The role you want to delete.")
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName("reason")
                    .setDescription("Reason for deleting the role.")
                    .setRequired(false)
                )
            )
            .addSubcommand((option) =>
            option
                .setName("demote")
                .setDescription("Used to take a certain role from someone but in a more chaotic and emotional way.")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to take the role from")
                    .setRequired(true))
                .addRoleOption(o => o
                    .setName("role")
                    .setDescription("The role to remove from them")
                    .setRequired(true))
            )
            .addSubcommand((option) =>
            option
                .setName("mentionable")
                .setDescription("Toggle if a role should be mentionable by everyone.")
                .addRoleOption(o => o
                    .setName("role")
                    .setDescription("The role to toggle.")
                    .setRequired(true))
                .addBooleanOption(o => o
                    .setName("mentionable")
                    .setDescription("Should be mentionable by everyone? (empty for toggle)")
                    .setRequired(false))
            )
            .addSubcommand((option) =>
            option
                .setName("promote")
                .setDescription("Gloriously give someone a role")
                .addUserOption(o => o
                    .setName("user")
                    .setDescription("The user to promote")
                    .setRequired(true))
                .addRoleOption(o => o
                    .setName("role")
                    .setDescription("What role to give them?")
                    .setRequired(true))
            )
        )
    }
    public async chatInputRun(interaction: Command.ChatInputInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const hexRegex = /^#(?:[\da-f]{3}){1,2}$/i;

        if(subcommand === "addrole"){
            const name = interaction.options.getString("name", true);
            const color = interaction.options.getString("color", true) as HexColorString;
            if (!hexRegex.test(color)) {
                return interaction.reply({ content: "Invalid hex color!\nMake sure your color starts with a `#` and has at least 3 digits.\nE.g. `#fff`, `#123f4d`", ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            const role = await interaction.guild?.roles.create({ name, color }).catch();
            const embed = new MessageEmbed()
                .setTitle("New role created!")
                .setDescription(`${interaction.user} has created the role ${role}\nHex: \`${color}\`\nID: \`${role?.id}\``)
                .setColor(color);

            return interaction.editReply({ embeds: [embed] });
        }
        else if(subcommand === "delrole"){
            const roleId = interaction.options.getRole("role", true).id;
            const role = await interaction.guild?.roles.fetch(roleId)

            const reason = interaction.options.getString("reason") || "";

            await interaction.deferReply({ ephemeral: true });

            try {
                await role?.delete(reason)
                return interaction.editReply({ content: `Successfuly deleted ${role?.name}!` });
            }
            catch (e) {
                if (e instanceof Error) {
                    await interaction.editReply({ content: "Sorry, can't delete that role!" });
                    error(e.message);
                }
            }
        }
        else if(subcommand === "demote"){

            if (!config.owner.includes(interaction.user.id)) return interaction.reply({ content: "No perms :(" });
            await interaction.deferReply();
            const user = interaction.options.getMember("user", true) as GuildMember;
            const roleId = interaction.options.getRole("role", true).id;
            const role = await interaction.guild?.roles.fetch(roleId)

            const random = ["https://i.imgur.com/fdfpF0K.gif", "https://i.imgur.com/wpEsa9Y.gif"]
            const gif = random[Math.floor(Math.random() * random.length)]

            const embed = new MessageEmbed()
                .setColor("#be0000")
                .setImage(gif)
                .setDescription(`__**${user} was found unworthy of his status**__. *Thus, ${role} along with all it's powers is effective immediately taken away from them till the day they prove their calibre again!* ${emoji.notAmused}${emoji.redTick}`)

            try {
                await user.roles.remove(role!)
                return interaction.editReply({ embeds: [embed] });
            }
            catch (e) {
                if (e instanceof Error) {
                    await interaction.editReply({ content: "Couldn't do it. Check your perms." })
                    error(e.message);
                }
            }
        }
        else if(subcommand === "mentionable"){
            const roleId = interaction.options.getRole("role", true).id;
            const role = await interaction.guild?.roles.fetch(roleId);
            const state = interaction.options.getBoolean("mentionable") || !role?.mentionable

            await interaction.deferReply({ ephemeral: true });

            try {
                await role?.setMentionable(state);
                return interaction.editReply({ content: `${role} is now ${state ? "" : "not"} mentionable by everyone!` })
            }
            catch (e) {
                if (e instanceof Error){
                    await interaction.editReply({ content: "Failed to edit role!" });
                    error(e.message)
                }
            }
        }
        else if(subcommand === "promote"){
            const user = interaction.options.getMember("user", true) as GuildMember;
            const roleId = interaction.options.getRole("role", true).id;
            const role = await interaction.guild?.roles.fetch(roleId)

            await interaction.deferReply()

            const random = ["https://i.imgur.com/ZARPpsF.gif", "https://i.imgur.com/JR1dfwp.gif", "https://i.imgur.com/8Czselh.gif", "https://i.imgur.com/ckxLBdv.gif", "https://i.imgur.com/lqCNTsa.gif"]
            const gif = random[Math.floor(Math.random() * random.length)]

            const embed = new MessageEmbed()
                .setColor("#FFD700")
                .setImage(gif)
                .setDescription(`👑 ***${user} is getting crowned with ${role} role for his glorious and unparalleled contribution to ${interaction.guild?.name} server!*** 👑`)

            try {
                await user.roles.add(role!);
                return interaction.editReply({ embeds: [embed] })
            }
            catch {
                return interaction.editReply({ content: `Couldn't do it, probably perms issue. ${emoji.ohShitLookAtTheTimeWatch}` })
            }
        }
    }
}
