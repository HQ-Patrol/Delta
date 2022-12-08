import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { ColorResolvable, GuildMember, MessageEmbed, TextChannel, Util } from "discord.js";
import { GuildModel as Guild } from '../../../database/models/GuildModel'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore // Used ts-ignore because randomcolor package is not supported with TS.
import  randomcolor from "randomcolor";
import ms from "ms";

@ApplyOptions<Command.Options>({
    name: "information",
    description: "Information related to bot"
})

export class InformationCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand((subcommand) =>
            subcommand
                .setName("bugreport")
                .setDescription("Report a bug to bot dev")
                .addStringOption((option) =>
                option
                    .setName("bug")
                    .setDescription("Bug")
                    .setRequired(true)
                )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("color")
                    .setDescription("Fetches a random color hex code. Good for finding a color for roles!")
                    .addStringOption((option) =>
                        option
                            .setName("color")
                            .setDescription("color")
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("emoji")
                    .setDescription("Wanna get a bigger version or the link of any custom emoji you like? Use this.")
                    .addStringOption((option) =>
                        option
                            .setName("emoji")
                            .setDescription("Emoji")
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("event")
                    .setDescription("Shows all the information about an on-going bot event!")
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("premium")
                    .setDescription("✨ To see all Premium features Patrol Bot offers to it's Special users ✨")
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("random-color")
                    .setDescription("Fetches a random color hex code. Good for finding a color for roles!")
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("updates")
                    .setDescription("DMs you all the information about the last Patrol Bot Update!")
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("uptime")
                    .setDescription("Displays the bot's current uptime!")
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();

        if(subcommand === "bugreport"){
            const bug = interaction.options.getString("bug")!;

            const embed = new MessageEmbed()
                .setTitle(`New Bug 🐛`)
                .setDescription(
                    `${interaction.user.tag} ID: ${interaction.user.id}\n${bug}`
                )
                .setTimestamp(interaction.createdTimestamp)
                .setFooter({ text: `${interaction.guild!.name}-[${interaction.guild!.id}]` });

            const channelToSend = (interaction.client.channels.cache.get("784116864686096385") as TextChannel)!
            // Send the bug report !
            try{
                await channelToSend.send({ embeds: [embed] });
            }
            catch(e){
                console.log(e)
            }

            return interaction.editReply({ content: "Thanks for reporting the 🐛" });

        }
        else if(subcommand === "color"){
            // Color sub-command
            let args: string[] =[];
            let isHex;
            const color = interaction.options.getString("color")!

            if((color.startsWith("#") && color.length === 7)) isHex = true
            else {
                isHex = false;
                args = color.split(",")
                 }

            if(!args.length && !isHex) return interaction.editReply({ content: "You seem to be doing something wrong`<a:exclamation:741988026296696872>\\nPlease type **color r,g,b** to get a color using **RGB** values from 0-255 `Example: {prefix}color 124,82,131`\\nIf you prefer hex codes instead, please type **color 000000** or **color #000000** `Example: {prefix}color #ffff00`" })

            let r;
            let g;
            let b;
            let totalColor;

            if(!isHex){
                let totalArgs;
                args[0].endsWith(',') ? totalArgs = args[0] : totalArgs = args[0].concat(',');
                if(args.length == 2) totalArgs = totalArgs.concat(args[1]);
                const splitArgs = totalArgs.split(',');
                r = parseInt(splitArgs[0]);
                g = parseInt(splitArgs[1]);
                b = parseInt(splitArgs[2]);

                if(r <= 0) r = 0;
                if(g <= 0) g = 0;
                if(b <= 0) b = 0;
                if(r > 255) r = 255;
                if(g > 255) g = 255;
                if(b > 255) b = 255;

                let red = r.toString(16);
                let green = g.toString(16);
                let blue = b.toString(16);

                if(r < 16) red = '0'.concat(red);
                if(g < 16) green = '0'.concat(green);
                if(b < 16) blue = '0'.concat(blue);

                totalColor = ''.concat(red).concat(green).concat(blue);
            }

            else{
                const embed = new MessageEmbed()
                    .setTitle("Here's the Color you asked for:")
                    .setColor((color as ColorResolvable))
                    .setThumbnail(`https://singlecolorimage.com/get/${color.substring(1)}/150x150`)

                return await interaction.editReply({ embeds: [embed] })
            }

            if(isNaN(r) || isNaN(g) || isNaN(b))
                return interaction.editReply({ content: "`You seem to be doing something wrong`<a:exclamation:741988026296696872>\nPlease type **color r,g,b** to get a color using **RGB** values from 0-255 `Example: {prefix}color 124,82,131`\nIf you prefer hex codes instead, please type **color 000000** or **color #000000** `Example: {prefix}color #ffff00`" })

            // Embed for non-hex input
            const embed = new MessageEmbed()
                .setTitle("Here's the Color you asked for:")
                .setColor((color as ColorResolvable))
                .setThumbnail(`https://www.colorcombos.com/images/colors/${totalColor}.png`)

            return await interaction.editReply({ embeds: [embed] })

        }
        else if(subcommand === "random-color"){
            // Random-color subcommand
            const hex = randomcolor()
            const embed = new MessageEmbed()
                .setTitle(hex)
                .setColor(hex)
                .setThumbnail(`https://singlecolorimage.com/get/${hex.substring(1)}/150x150`)

            await interaction.editReply({ embeds: [embed] })
        }
        else if(subcommand === "emoji"){
        // Emoji sub-command
            const emoji = interaction.options.getString("emoji")! ;
            const parsedEmoji = Util.parseEmoji(emoji);

            if(!parsedEmoji!.id) return interaction.editReply({ content: "Please give a valid emoji! " })
            const link = `https://cdn.discordapp.com/emojis/${parsedEmoji!.id}${parsedEmoji!.animated ? ".gif" : ".png"}`

            return interaction.editReply({ content: link })
        }
        else if(subcommand === "event"){
            return interaction.editReply({ content: "No event running at the moment. Try again near the festival times <:EricaThumbsUp:898319470882349067>" })
        }
        else if(subcommand === "invite"){
            // Invite sub-command
            const embed = new MessageEmbed()
                .setThumbnail("https://i.imgur.com/ab2g21s.gif")
                .setTitle('Do you enjoy using Patrol Bot?')
                .setColor("BLUE")
                .setDescription("👉 [**Click here to Invite Erica to your server**](https://discord.com/api/oauth2/authorize?client_id=763506280421392466&permissions=8&scope=bot) <a:PatrolBot:736282237225533571>\n"+
                    "👉 [**Click here to Invite Veronica to your server**](https://discord.com/api/oauth2/authorize?client_id=943115378349993984&permissions=414467870272&scope=bot) <:Veronica:943463957300146176>\n"+
                    "👉 [**Click here to Join Support Server**](https://discord.gg/HQ) <a:HGIcon:774666165262745641>")

            return interaction.editReply({ embeds: [embed] })
        }
        else if(subcommand === "premium"){
            // Premium Subcommand
            const guild = await Guild.findOne({ _id: interaction.guild!.id }).lean()

            const Embed = new MessageEmbed()
                .setAuthor({ name: `Patrol Bot Premium Perks:`, iconURL: `https://i.imgur.com/ceVxXxK.gif` })
                .setDescription(`Visit https://patrolbot.xyz/store or [**Click here**](https://patrolbot.xyz) to purchase Premium!\n\n`+
                    `➽ **${guild?.prefix}weekly**: Get Special Weekly Prize of: Mystery Box and Medium Boiled Egg exclusive to only Premium! <a:Cheers:738820410681851915>\n`+
                    `➽ **Pets Limit**: Increase your Total Pets Capacity from Maximum of \`10\` to **\`20\` <a:QuaggiGIF:927190477118263296>** \n`+
                    `➽ **Voting Commands**: All Voting cooldowns (Simpvote, Social-credit, Mod-vote, etc) gets their cooldown reduced by \`50%\` <a:GoVote:787376884731478046>\n`+
                    `➽ **Exclusive Tasks**: Be able to complete all Premium-only Weekly and Monthly tasks for FREE Rare Mystery Boxes <a:FindingNukes:728258193565810778>\n`+
                    `➽ **${guild?.prefix}work**: Get upto 5 extra high paying jobs <:EricaEvilPlotting:897841584647847986>\n`+
                    `➽ **${guild?.prefix}fight ON/OFF**: Turn off fight-mode at your own will and never lose/get muted <a:LetsFight:771073637376852030>\n`+
                    `➽ **${guild?.prefix}vote**: Get \`x2\` the reward a normal users get per vote! <:Topgg:850043780702797854>\n`+
                    `➽ **Item Usage**: Increase from \`3\` at a time to **\`25\`** <:GotThat:842141052752363543>\n`+
                    `➽ **Special Item - Snitch Demon**: If activated and someone tries robbing you, empties robber's wallet and Bank upto \`50%\` <a:robbery:775808009825157178>\n`+
                    `➽ **Wallet Locks Limit**: Increase from \`50\` at a time to \`150\` <a:Lock:744641130792222730>\n`+
                    `➽ **${guild?.prefix}cookie bag**: Know how many cookies you've distributed in a server and who's your fav person to give cookies to! <a:PandaEat:796098914758426675>\n`+
                    //`➽ **${guild?.prefix}AFK**: Let's you add Links in your AFK Message <a:Notes:752905873357013094>\n`+
                    `➽ **${guild?.prefix}createnotes | Avatar Description | ${guild?.prefix}setdescription** -\nDouble your word limit and Links get by-passed! <a:NoteTaking:752914759992475779>\n`+
                    `➽ **${guild?.prefix}marry prenup**: Sign a prenuptial with your partner while getting married to avoid losing any money if a divorce strikes <a:HamsterJigga:731172699639906397>\n`+
                    `➽ **${guild?.prefix}reps/modvotes/simpvotes info**: Let's you see more information about your Votes History <a:BarryTheNerd:916028055099678780>\n`+
                    `➽ **Premium-Only Giveaways**: Be allowed to Participate in the Exclusive Premium users-Only Giveaways in [__Patrol Bot HQ/Support__](https://discord.gg/HQ) <a:Tada:760515869603790928>`)
                .setFooter({ text: `🌟 Lots of Premium features in works for future drops!🤓` })

            try {
                await interaction.user.send({ embeds: [Embed] });

                await interaction.editReply(`${interaction.user}, Check your DMs for all the Information Premium Patrol Bot-related 🤩`)

            }
            catch{
                return interaction.editReply({ content: "`Unlucky! You have your DM's closed` <:sus:715633189871419554>" })
            }
        }
        else if(subcommand === "updates"){
            // Updates sub-command
            try {
                await (interaction.member as GuildMember).send({ content: "Hey! For any Query regarding Patrol Bot Updates/Changes, Daily Giveaways/Raffles, Exclusive Benefits\n👉 __**Join Patrol Bot Support Server**__: https://discord.gg/HQ [<#762930247061995527>] " })
                await interaction.editReply({ content: "Check your DMs !" })
            }
            catch{
                return interaction.editReply({ content: "`Unlucky! You have your DM's closed` <:sus:715633189871419554>" })
            }
        }
        else if(subcommand === "uptime"){
            // Uptime sub-command
            return interaction.editReply({ content: `My uptime is \`${ms(interaction.client.uptime!, { long: true })}\` <a:Loading:727148666837663765>` })
        }
    }
}