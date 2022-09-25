import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "rules",
    description: "Shows information about Patrol bot fair-use rules!"
})

export class RulesCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        
        // Main Command
        await interaction.deferReply();
        const embed = new MessageEmbed()
            .setTitle("🚨 Patrol Bot Fair-use Rules and Guidelines 📜")
            .setDescription("<a:Right:763251259896758282> Everyone is required to follow all Server rules along with Bot rules at all time!")
            .addFields(
                {
                    name: '#1 Spamming',
                    value: `\`\`\`Spamming Bot commands in any unfair way possible\`\`\``,
                    inline: true
                },
                {
                    name: '#2 Raiding',
                    value: `\`\`\`Using bot to Raid or create Chaos in any server in any way possible\`\`\``,
                    inline: true
                },
                {
                    name: '#3 Alting',
                    value: `\`\`\`Using more than 1 account for Economy/Event purposes\`\`\``,
                    inline: true
                },
                {
                    name: '#4 Macro-ing',
                    value: `\`\`\`Using Auto-typers, Auto-bots or Scripts of any Shape or Form\`\`\``,
                    inline: true
                },
                {
                    name: '#5 Soliciting Reps/Coins',
                    value: `\`\`\`Don't indule yourself in it 💀\`\`\``,
                    inline: true
                },
                {
                    name: '#6 Trading for IRL/Different Bot Currency',
                    value: `\`\`\`Self-explanatory, don't do that\`\`\``,
                    inline: true
                },
                {
                    name: '#7 Sending TOS-Breaking DMs',
                    value: `\`\`\`Abusing DM Command to send Unsolicited, NSFW, Un-safe or unnecessary DMs\`\`\``,
                    inline: true
                },
                {
                    name: '#8 Promoting Hate',
                    value: `\`\`\`Indulging in any sort of Toxicity, Hate, Homophobia, Xenophobia, Racism, etc IS NOT allowed using Bot\`\`\``,
                    inline: true
                },
                {
                    name: '#9 Scamming',
                    value: `\`\`\`Please don't attempt Duping any User in any Shape or form whatsoever. Please be Morally responsible!\`\`\``,
                    inline: true
                },
                {
                    name: '#10 Abusing Bugs',
                    value: `\`\`\`If you report a bug, depending on the intensity you shall be rewarded beautifully. While on the other hand if you decide to Abuse it, it'll even in Vain 🙂\`\`\``,
                    inline: true
                },
            )
            .setFooter({ text: "➤ Contact @Sinless#0001 for Any other Issues! 📬", iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

        try{
            await interaction.user.send({ embeds: [embed] })
            return interaction.editReply("⚖ Please Check your DMs for the list of all Bot Rules! 📜")
        }
        catch{
            return interaction.editReply({ content: "`Unlucky! You have DM's closed` <:sus:715633189871419554> Please turn them on 🎇" })
        }
    }

}