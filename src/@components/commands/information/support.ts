import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";


@ApplyOptions<Command.Options>({
    name: "support",
    description: "Invites you to our Official Patrol Bot Support Server!"
})

export class SupportCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        return interaction.reply({ content: `Hey! <:EricaHeartEyes:897841580654878760>\nFor any Query regarding Patrol Bot, Daily Giveaways/Raffles, Exclusive Benefits\n👉 __**Join Patrol Bot Support Server**__: https://discord.gg/HQ` })

    }
}