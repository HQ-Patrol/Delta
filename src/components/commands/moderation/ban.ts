import { Message } from 'discord.js';
import { ApplyOptions } from "@sapphire/decorators";
import { Command, ChatInputCommand, Args } from "@sapphire/framework";

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