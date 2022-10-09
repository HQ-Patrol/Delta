import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-ignore
import urban from 'relevant-urban';
import { MessageEmbed,  TextChannel } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "urban",
    description: "Find the urban Dictionary definition of any word!"
})

export class UrbanCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
            option
                .setName("word")
                .setDescription("Word")
                .setRequired(true)
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        if(!(interaction.channel as TextChannel).nsfw) return interaction.reply({ content: '`This channel needs to be marked NSFW for the command to work!` 🔞' })
        const query = interaction.options.getString("word")!;
        const result = await urban(query).catch(() => null);
        if(!result) return interaction.reply({ content: `Unknown word/phrase: **${query}**, maybe try again?🥱` })

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(result.word.toUpperCase())
            .setURL(result.urbanURL)
            .setDescription(`**Definition:**\n\`\`\`${result.definition}\`\`\` \n\n**Example:**\n\`${result.example}\``)
            .addFields({
                name: "Author: ",
                value: result.author,
                inline: true
            },
                {
                    name: "Rating:",
                    value: `👍 ${result.thumbsUp.toLocaleString()} | 👎 ${result.thumbsDown.toLocaleString()}`
                })

        if(result.tags.length > 0 && result.tags.join(" ").length < 1024) {
            embed.addFields({ name: "Tags", value: result.tags.join(", "), inline: true })
        }
        return interaction.reply({ embeds: [embed] });
    }
}