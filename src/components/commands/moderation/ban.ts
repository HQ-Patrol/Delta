/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-empty */
import { Formatters, GuildMember, Message } from 'discord.js';
import { ApplyOptions } from "@sapphire/decorators";
import { Command, ChatInputCommand, Args } from "@sapphire/framework";
import { ApplicationCommandType } from 'discord-api-types/v10';

@ApplyOptions<Command.Options>
(
	{
		name: "ban",
		description: "Bans a user",
		requiredUserPermissions: ['BAN_MEMBERS']
	}
)
export class BanCommand extends Command {

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.setDMPermission(false)
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
			const userToGreetMention = Formatters.userMention(interaction.targetMember.id);
			return interaction.reply({
			  content: `${userToGreetMention} has been successfully banned`,
			  allowedMentions: {
				users: [interaction.targetMember.id]
			  }
			});
		  }
		}
	public async messageRun(message: Message, args: Args) {

		const userToBan = await args.pick('member');
		const reason = await args.pick('string').catch(() => "None");

		if (!userToBan.bannable || !userToBan.kickable) {
        return message.reply("You cannot ban this user!")

		} else {
			userToBan.ban({ reason: reason });
			return message.reply(`Successfully banned ${userToBan} with Reason: ${reason}`)
		}
	}
}