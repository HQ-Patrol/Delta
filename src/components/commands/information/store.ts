import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";


@ApplyOptions<Command.Options>({
    name: "store",
    description: "Links you to Patrol Bot Store/Website"
})

export class StoreCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        return interaction.reply({ content: `Hey! <:EricaHeartEyes:897841580654878760>\\nIf you're interested in Purchasing some Patrol Bot Premium <a:Premium1M:875427336898625586>, RARE Mystery Boxes <:MysteryBoxXXX:855561382795149322> or Craziest Spawn Rate Eggs <:HardBoiledEgg:922055217539854337>\\n👉 __**Visit our Store**__: https://patrolbot.xyz/store` })

    }
}