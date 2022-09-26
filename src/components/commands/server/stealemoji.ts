import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, MessageEmbed, Util } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "stealemoji",
    description: "Steal any emoji from a different server 🥴"
})

export class StealEmojiCommand extends Command{
    public registerApplicationCommands(registry: ChatInputCommand.Registry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
            option
                .setName("emoji")
                .setDescription("Emoji")
                .setRequired(true)
            )
            .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Emoji Name")
                .setRequired(true)
            )
        )
    }

    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        await interaction.deferReply();
        if(!(interaction.member as GuildMember).permissions.has("MANAGE_EMOJIS_AND_STICKERS")) return interaction.editReply({ content: "You need the MANAGE_EMOJIS_AND_STICKERS permission" })

        const parsedEmoji = Util.parseEmoji(interaction.options.getString("emoji")!)

        if(!parsedEmoji!.id) return interaction.editReply({ content: "Please give a valid emoji!" })
        const customLink = `https://cdn.discordapp.com/emojis/${parsedEmoji!.id}.${parsedEmoji!.animated ? "gif" : "png"}`;
        try{
            await interaction.guild!.emojis.create(customLink, interaction.options.getString("name")!)

            const embed = new MessageEmbed()
                .setTitle("Emoji Added ☑")
                .setColor("BLUE")
                .setDescription(
                    `__**Name:**__ \`${interaction.options.getString("name")}\` | __Preview__: [Click Here](${customLink})`
                )
                .setThumbnail(customLink);
            await interaction.editReply({ embeds: [embed]})

        }
        catch (e) {
            if (
                String(e).includes(
                    "DiscordAPIError: Maximum number of emojis reached (50)"
                )
            ) {
                return interaction.editReply({
                    content: "Maximum emoji count reached for this guild!"
                });
            } else {
                return interaction.editReply({
                    content: "You can only **Steal** an emote from a different server. If you want to add a make a new emote, go to server-settings :)"
                });
            }
        }
    }
}