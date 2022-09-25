import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command, CommandStore } from "@sapphire/framework";
import {  MessageEmbed } from "discord.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { stripIndents } from 'common-tags';
@ApplyOptions<Command.Options>({
    name: "commands",
    description: "Returns all commands, or one specific info"
})

export class Commands extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Command")
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        const { stores }  = this.container;
        const allCommands = stores.find(s => s.name === "commands") as CommandStore;
        await interaction.deferReply();
        const cmd = interaction.options.getString("command");
        if(cmd){
            const result = allCommands?.get(cmd)
            if(!result) return interaction.editReply({ content: `Could not find any results for ${cmd} !` })

            let info;
            info = `**Command name**: ${result.name}`;
            info += `\n**Description**: ${result.description}`;
            info += `\n**Category**: ${result.category}`

            const embed = new MessageEmbed()
                .setTitle(`${result.name}`)
                .setColor("RANDOM")
                .setDescription(info)
                .setFooter({ text: `Requested by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            await interaction.editReply({ embeds: [embed] })

        }
        else{
            // Display All the commands without the info !
            const emojis :any = {
                "fun": "🏀",
                "actions": "🕺",
                "nsfw": "🔞",
                "pets": "🐶",
                "economy": "💸",
                "minigames": "🎲",
                "users": "👤",
                "miscellaneous": "📰",
                "server": "🏨",
                "moderation": "🛠",
                "information": "🔍",
                "extras": "🧐",
                "settings": "⚙️",
            }

            // All the categories
            const categories = [
                "actions",
                "economy",
                "information",
                "extras",
                "fun",
                "minigames",
                "miscellaneous",
                "moderation",
                "pets",
                "server",
                "settings",
                "users",
                "XXX",
            ]
            const commands = (category: string) => {
                return allCommands
                    .filter(cmd => cmd.category === category)
                    .map(cmd => `\`${cmd.name}\``)
                    .join(" | ");
            }

            //Map all the categories
            const embedarray = [];
            const cattocommands : any= {}; // Add a type to this.
            categories.forEach(cat => cattocommands[stripIndents(`**${(emojis[cat] ? emojis[cat] : "") + cat[0].toUpperCase() + cat.slice(1)} Commands**`)] = commands(cat))

            let i, j;
            for (i = 0; i < Math.ceil(categories.length/5); i++) {

                const embed = new MessageEmbed()
                    .setAuthor({ name: "Patrol Bot : Commands List", iconURL: interaction.client.user!.displayAvatarURL({ dynamic: true }) })
                    .setColor("BLUE")
                    .setDescription(`Looks like you want to see all my majestic powers? Here's the full list of all my Commands.`)
                    .setFooter({ text: `By: Sinless#0001 • https://patrolbot.xyz 🚨`, iconURL: "https://i.imgur.com/YTMhQOx.gif" })

                for (j = i*5; j < (i*5)+5; j++) {
                    const entries: any = Object.entries(cattocommands)[j]
                    if (!entries || entries[0] === '' || entries[1] === '') continue;
                    embed.addFields([
                        {
                            name: entries[0],
                            value: entries[1]
                        }
                    ])
                }
                embedarray.push(embed)
            }
            await interaction.editReply({ content: "Please Check your DMs for a full list of commands! <a:PatrolBot:736282237225533571>" })

            try{
                const channel = await interaction.user.createDM() ;
                for (i = 0; i < embedarray.length; i++) {
                    channel.send({ embeds: [embedarray[i]] })
                }
            }
            catch{
                return interaction.editReply({ content: "`Unlucky! You have DM's closed` <:sus:715633189871419554>" });
            }
        }
    }
}