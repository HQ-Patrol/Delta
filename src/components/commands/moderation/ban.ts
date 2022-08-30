/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-empty */
import { GuildMember, Permissions } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplicationCommandType } from "discord-api-types/v10";

@ApplyOptions<Command.Options>
(
	{
		name: "ban",
		description: "Bans a user",
		requiredClientPermissions: "BAN_MEMBERS"
	}
)
export class BanCommand extends Command {

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.setDMPermission(false)
				.setDefaultMemberPermissions(Permissions.FLAGS.BAN_MEMBERS)
				.addUserOption(o => o
					.setName("user")
					.setDescription("User to be banned.")
					.setRequired(true)
				)
				.addStringOption(o => o
					.setName("reason")
					.setDescription("Reason for the ban.")
					.setRequired(false))
		)
		registry.registerContextMenuCommand((builder) => {
			builder
				.setName(this.name)
				.setType(ApplicationCommandType.User)
		})
	}

	public override async contextMenuRun(interaction: Command.ContextMenuInteraction) {
		if (interaction.isUserContextMenu() && interaction.targetMember instanceof GuildMember) {
			await interaction.targetMember.ban();
			return interaction.reply({
			  content: `${interaction.targetMember} has been successfully banned!`,
			  allowedMentions: {
				users: [interaction.targetMember.id]
			  }
			});
		  }
		}

	public async chatInputRun(interaction: Command.ChatInputInteraction){
		const banned = interaction.options.getMember("user") as GuildMember;
		const reason = interaction.options.getString("reason") || "Not provided."

		if (!banned.bannable){
			return interaction.reply({ content: "You cannot ban this user!", ephemeral: true })
		} else {
			interaction.deferReply({ ephemeral: true });
			await banned.ban({ reason });
			interaction.editReply({ content: `${banned} has been successfully banned with reason of: \`${reason}\`!` })
		}
	}
}
