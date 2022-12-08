import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "invite",
    description: "Invite our bot"
})

export class InviteCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }
    public chatInputRun(interaction: ChatInputCommand.Interaction) {

        const embed = new MessageEmbed()
            .setThumbnail("https://i.imgur.com/ab2g21s.gif")
            .setTitle('Do you enjoy using Patrol Bot?')
            .setColor("BLUE")
            .setDescription("👉 [**Click here to Invite Erica to your server**](https://discord.com/api/oauth2/authorize?client_id=763506280421392466&permissions=8&scope=bot) <a:PatrolBot:736282237225533571>\n"+
                "👉 [**Click here to Invite Veronica to your server**](https://discord.com/api/oauth2/authorize?client_id=943115378349993984&permissions=414467870272&scope=bot) <:Veronica:943463957300146176>\n"+
                "👉 [**Click here to Join Support Server**](https://discord.gg/HQ) <a:HGIcon:774666165262745641>")

        return interaction.reply({ embeds: [embed] })
    }
}