import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import  { Message, MessageEmbed, Formatters, User, GuildMember } from "discord.js";
import figlet from 'figlet';
import fetch from 'node-fetch';
import UserWeeklyMissionsModel from "../../../database/models/UserWeeklyMissionsModel";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import randomPuppy from 'random-puppy';

@ApplyOptions<Command.Options>({
    name: "fun",
    description: "Let's have some fun!"
})

export class FunCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                option
                    .setName("choice")
                    .setDescription("Choice")
                    .setRequired(true)
                    .addChoices({
                        name: "8ball",
                        value: "8ball",
                    },
                        {
                            name: "50-50",
                            value: "50-50"
                        },
                        {
                            name: "ascii",
                            value: "ascii"
                        },
                        {
                            name: "asktrump",
                            value: "asktrump"
                        },
                        {
                            name: "based",
                            value: "based"
                        },
                        {
                            name: "cock",
                            value: "cock"
                        },
                        {
                            name: "compliment",
                            value: "compliment"
                        },
                        {
                            name: "dadjoke",
                            value: "dadjoke"
                        },
                        {
                            name: "dicksize",
                            value: "dicksize"
                        },
                        {
                            name: "gaymeter",
                            value: "gaymeter"
                        },
                        {
                            name: "hornymeter",
                            value: "hornymeter"
                        },
                        {
                            name: "lovemeter",
                            value: "lovemeter"
                        },
                        {
                            name: "meme",
                            value: "meme"
                        },
                        {
                            name: "thotmeter",
                            value: "thotmeter"
                        },
                        {
                            name: "waifumeter",
                            value: "waifumeter"
                        },
                        {
                            name: "roast",
                            value: "roast"
                        }

                    )
                )
        )
    }

    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        const choice = interaction.options.getString("choice");

        const filter = (msg: Message) => {
            if(msg.member?.id === interaction.user.id){
                return true
            }
            else {
                return false
            }
        }

        if(choice === "8ball"){
            const ItalicisedText = Formatters.italic("(There is a big chance I insult you!)")
            const msg = await interaction.reply({ content: `Please specify your question! ${ItalicisedText}`, fetchReply: true }) as Message;

            const responses = [
                "Yes!",
                "No!",
                "Better not tell you now.",
                "Don't count on it.",
                "Most likely.",
                "Cannot predict now.",
                "Outlook not so good.",
                "Outlook good.",
                "Very doubtful.",
                "Without a doubt.",
                "Not in a million years🤣",
            ];
            const question = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null)
            if(!question || question.size === 0){
                return msg.edit({ content: "You took too long!" }).catch(() => null);
        }
           if(!question.first()!.content) return ;

            const result = responses[Math.floor(Math.random() * responses.length - 1)];
            const Embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.username, url: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`🎱8Ball`)
                .setDescription(`My reply: \`${result}\``)
                .setColor("BLUE");

            await msg.channel.send({ embeds: [Embed] });
            return msg.edit({ content: "Interaction completed." }).catch((err: Error) => console.log(err) );
        }
        else if(choice === "50-50"){
           // const msg = await interaction.reply({ content: "Play the classic Reddit 50-50 game. You are given 2 descriptions and there's a 50-50 chance of either of it being in the link. Try it yourself! 😈 [ `There's a HIGH as f chance of it showing serious NSFW stuff. So beward!` ⚠]\nYou can either play yourself, OR dare your friend to play!\n__**Usage:**__\n- `!50-50`\n- `!50-50 dm`\n- `!50-50 @User\n- `!50-50 @User dm``", fetchReply: true  }) as Message;
            return interaction.reply(`Thanks for using 50-50 Command but due to Discord Restrictions & Rules, we'll be moving the Command to NSFW Category and re-launch it with __**v5.0 Update**__!`)
        }
        else if(choice === "ascii"){
            const msg = await interaction.reply({ content: "Convert text to ascii.Give in some text ! ", fetchReply: true }) as Message;
            const text = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null)
            if(!text || text.size === 0){
                return msg.edit({ content: "You took too long!" }).catch(() => null);
            }
            if(!text.first()!.content) return;
            figlet.text(text.first()!.content, function(err: any, data: any){
                if(err){
                    console.log(err);
                    return ;
                }
                if(data!.length! > 2000) {
                    return msg.channel.send( { content: "Please provide text shorter than 2000 characters" })
                }
                const formattedText = Formatters.codeBlock(data!)
                return msg.channel.send({ content: formattedText })
            })
        }
        else if(choice === "asktrump"){
            const msg = await interaction.reply({ content: "Ask 45th President of United States of America about someone/something 🙌", fetchReply: true }) as Message;
            const question = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null)
            if(!question || question.size === 0){
                return msg.edit({ content: "Don't waste the time of our President!" }).catch(() => null);
            }
            if(!question.first()!.content) return ;

            fetch("https://api.whatdoestrumpthink.com/api/v1/quotes")
                .then(async (res) => res.json())
                .then(async (body) =>{
                    //console.log(body.msgs.personalized)
                    if(!body) return msg.edit("Whoops I broke again please try again !");

                    const arr = body.messages.personalized;
                    const embed = new MessageEmbed()
                        .setTitle("What does Trump has to say about it?")
                        .setColor("BLUE")
                        .setThumbnail("https://i.imgur.com/Pv1lWQk.gif")
                        .setDescription(`**${question.first()!.content}** ${body.msgs.personalized[Math.floor(Math.random()* arr.length)] }`)
                        .setTimestamp(msg.createdTimestamp)

                    await msg.channel.send({ embeds: [embed] })
                    return msg.edit({ content: "Interaction complete." }).catch(() => null);

                })

        }
        else if(choice === "based"){
            const msg = await interaction.reply({ content: "Are you based and blue-pilled????? Let's find out! Tag Someone!", fetchReply: true }) as Message;
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);
            if(!result || result.size === 0) return msg.edit({ content: "You too long enough." })

            //console.log(result.first()!.mentions.users)
            let member = result.first()!.mentions.users.first()!
            if(!member) member = interaction.member!.user as User;
            let based;
            let pill;

            if(member.id.startsWith("1") || member.id.startsWith("3") || member.id.startsWith("5") || member.id.startsWith("7") || member.id.startsWith("9")) { 
                based = "a Cuck" 
            } 
            else {
                based = "Based"
            }

            if(member.id.endsWith("1") || member.id.endsWith("3") || member.id.endsWith("5") || member.id.endsWith("7") || member.id.endsWith("9")) { 
                pill = "Red-pilled"
            } 
            else {
                pill = "Blue-pilled"
            }

            // Embed
            const embed = new MessageEmbed()
                .setTitle("🤠 __**Reality Check**__ 🧐")
                .setAuthor({ name: member.username, iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setColor("RANDOM")
                .setDescription(`👉 You are **${based}** and **${pill} 🥵**`)

            if (based=="Based" && pill == "Red-pilled") { embed.setThumbnail("https://i.imgur.com/bjvaYon.jpg")}
            else if(based=="a Cuck" && pill == "Blue-pilled") { embed.setThumbnail("https://i.gifer.com/K1YP.gif")}
            else { embed.setThumbnail("https://media1.giphy.com/media/WoF3yfYupTt8mHc7va/200.gif"); }

            await msg.channel.send({ embeds: [embed] });

            // Weekly Section
            if(based === "a Cuck" && pill === "Red-pilled"){
                const weeklyData = await UserWeeklyMissionsModel.findOne({ id: msg.author.id });
                if(!weeklyData) {
                    await UserWeeklyMissionsModel.create({ id: msg.author.id, based: { value: 1, prize: false, prizePlus: false } })
                }
                else{
                    if(weeklyData.based.value > 0){
                        weeklyData.based.value+=1;
                    }
                    else{
                        weeklyData.based.value=1;
                    }
                    await weeklyData.save().catch(() => null);
                }
            }
            // Weekly End.

            return msg.edit({ content: "Interaction Completed." }).catch(() => null);
        }
        else if(choice === "cock"){
            const msg = await interaction.reply({ content: "Send Cock pictures to anyone of any age 😻 Isn't that wonderfully weird to hear! <:EricaEvilPlotting:897841584647847986> (PS: Tag someone!)", fetchReply: true }) as Message;
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);
            if(!result) return msg.edit({ content: "You too long enough." })

            const member = result.first()!.mentions.users.first() as User;
            
            if(!member) {return msg.channel.send("ya need to mention some lucky person to show your treasure to 😳").then(m => setTimeout(() => m.delete(), 4000))}
            if(member.id=== interaction.user.id) { const em = new MessageEmbed().setImage("https://i.imgur.com/imaKTGj.png").setFooter({ text: "That's kinda gay bro" }); return msg.channel.send({ embeds: [em] }); }

            const memberz = await msg.guild!.members.fetch(member.id);

            if(memberz.roles.cache.some(role => role.id=="701502294692331573")) {
                return msg.channel.send("They're not interested.").then(m => setTimeout(() => m.delete(), 2500))
            }

            const randomck = ["https://i.imgur.com/uS3QVmT.jpg", "https://i.imgur.com/zbPpw9b.jpg", "https://i.imgur.com/qcaJ54m.png", "https://i.imgur.com/zlROylk.jpg", "https://i.imgur.com/lZ6R6il.jpg", "https://i.imgur.com/oCdNFJr.jpg", "https://i.imgur.com/cq3Pn8a.jpg", "https://i.imgur.com/XcIzIJ9.jpg", "https://i.imgur.com/0iSSPOA.png"]
            const chicken = randomck[Math.floor(Math.random() * randomck.length)]

            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor({ name: `${ msg.author.username }'s beautiful cock! 😻 Enjoy`, iconURL: msg.author.displayAvatarURL() })
                .setImage(chicken)

            return memberz.user.send({ embeds: [embed] }).then(() => msg.channel.send(`${ interaction.user } sent their ||COCK 😳|| to ${memberz.user}! Gg <:bet:715633188457676931>`)).catch(() => msg.channel.send("`Unlucky! That user has their DM's closed` <:sus:715633189871419554>"));
        }
        else if(choice === "compliment"){
            fetch("https://complimentr.com/api")
                .then(async(res) => res.json())
                .then(async(body) => {
                    if(!body) return interaction.reply({ content: "Whoops I broke try again!" })
                    const embed = new MessageEmbed()
                        .setColor("#f4c2c2")
                        .setDescription(`<:Loved:731169944775032852> **${interaction.user}, ${body.compliment}** <a:heart_gif:731170667671584860>`)

                    return interaction.reply({ embeds: [embed] })
                })
        }
        else if(choice === "dadjoke"){
            const msg = await interaction.reply({ content: "<a:HamsterJigga:731172699639906397> Drinking the wife-beater potion...", fetchReply: true }) as Message;
            fetch("https://icanhazdadjoke.com/slack")
                .then(res => res.json()).then(body => {
                if(!body) return msg.reply(" Whoops. I broke, try again!")

                const embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`**${body.attachments[0].text}**`)

                msg.channel.send({ embeds: [embed] });
                return msg.edit({ content: "Interaction Completed." }).catch(() => null)
            })
        }
        else if(choice === "dicksize"){
            const msg = await interaction.reply({ content: "How long is your Dick or somebody else\\'s?  (Tag someone! )", fetchReply: true }) as Message;
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);
            if(!result) return msg.edit({ content: "You too long enough." })

            const user = result.first()!.mentions.users.first() ;
            const randomPPsize = ["No cock 😱", "8D", "8=D", "8==D", "8===D", "8====D", "8=====D", "8======D", "8=======D", "8========D", "8==========D", "8===========D", "8==========D", "8=============D", "8===============D", "8================D", "8D", "8=D", "8==D", "8===D", "8====D", "8=====D", "8======D", "8=======D", "8========D", "8==========D", "8===========D", "8==========D", "8=============D", "8===============D", "8================D"]
            const ppsize = randomPPsize[Math.floor(Math.random() * randomPPsize.length)]
            const randomballsize = ["Non-existent", "Small", "Medium", "Huge", 'HUMONGOUS ASS BALLS', "Small", "Medium", "Huge", "Small", "Medium", "Huge", "Small", "Medium", "Huge", "Small", "Medium", "Huge"];
            const ballsize = randomballsize[Math.floor(Math.random() * randomballsize.length)];
            const Footer = ["I can’t even see it there are pubes through and through, have you ever cut your pubes?", "There is more foreskin than actual cock and your nuts are hanging down to your ankles.", "Average", "Nothing much to see there tbh", "Meh", "Can do better", "Visit: https://www.healthline.com/health/mens-health/penis-enlargement-surgery-cost", "I can’t even see it there are pubes through and through, have you ever cut your pubes?", "Ok cock", "Average", "Nothing much to see there tbh", "Meh", "Can do better", "Average", "Nothing much to see there tbh", "Meh", "Can do better", "Treat yourself better bc this isn't looking well for you 😭", "Treat yourself better bc this isn't looking well for you 😭", "Cock has massive amounts of curvature. There really seems to be no way to use it.", "You hit puberty yet?", "You hit puberty yet?", "Not a good look.", "Do better.", "Do better."];
            const foot = Footer[Math.floor(Math.random() * Footer.length)];


            if(!user) return;
            if(user){
                // For a user
                if(user.id==="179911663586246656" || user.id === "179911663586246656"){
                    const ppsizeembed = new MessageEmbed()
                        .setTitle("🍆 Dick Size Calculator")
                        .setColor("BLUE")
                        .setDescription(`**User :** ${user.username}`)
                        .addFields({
                            name: `D-Size :`,
                            value: `\`\`\`8=======================D\`\`\``,
                            inline: true
                        },
                            {
                                name: `Balls :`,
                                value: `\`\`\`HUGE\`\`\``,
                                inline: true
                            }
                        )
                        .setFooter({ text: 'You are truly blessed.' })
                    
                    return msg.channel.send({ embeds: [ppsizeembed] })
                }
                else if(user.id==="315750854298828801"){
                    const ppsizeembed = new MessageEmbed()
                        .setTitle("🍆 Dick Size Calculator")
                        .setColor("BLUE")
                        .setDescription(`**User :** ${user.username}`)
                        .addFields({
                            name: `D-Size :`,
                            value: `\`\`\`8=======================D\`\`\``,
                            inline: true
                        },
                            {
                                name: `Balls :`,
                                value: `\`\`\`HUMONGOUS ASS BALLS\`\`\``,
                                inline: true
                            })
                        .setFooter({ text: 'You have the greatest cock and balls known to man, your cock and balls were created by the finest sculptors to ever walk the earth. From the balls to the shaft to the tip there is not a single flaw, both the cock and balls are huge which come together to cause a symphony of pleasure to whoever you’re with. You are truly blessed' })
                    
                    return msg.channel.send({ embeds: [ppsizeembed] })
                    
                }//Lusty Is tagged
                else if(user.id === "840443760248619019") {
                    const ppsizeembed = new MessageEmbed()
                    .setTitle("BOT HAS MALFUNCTIONED....")
                    .setColor("PURPLE")
                    .setImage("https://i.imgur.com/lKAVtH8.gif")
                    return msg.channel.send({ embeds: [ppsizeembed] })
                }
                else {
                    const ppsizeembed = new MessageEmbed()
                        .setTitle("🍆 Dick Size Calculator")
                        .setColor("BLUE")
                        .addFields({
                            name: `D-Size :`,
                            value: `\`\`\`${ppsize}\`\`\``,
                            inline: true
                        },
                            {
                                name: `Balls :`,
                                value: `\`\`\`${ballsize}\`\`\``,
                                inline: true
                            }
                        )
                        .setDescription(`**User :** ${user.username}`)
                    
                    if(ballsize == "Non-existent" && ppsize == "No cock 😱") {ppsizeembed.setFooter({ text: `There is literally nothing there, what are you showing me? You actually have no cock or balls 😐` })}
                    else if(ballsize == "HUMONGOUS ASS BALLS" && ppsize == "8================D") {ppsizeembed.setFooter({ text: "You have the greatest cock and balls known to man, your cock and balls were created by the finest sculptors to ever walk the earth. From the balls to the shaft to the tip there is not a single flaw, both the cock and balls are huge which come together to cause a symphony of pleasure to whoever you’re with. You are truly blessed." })}
                    else if(ppsize == "8=============D" || ppsize == "8===========D" || ppsize == "8===============D") {ppsizeembed.setFooter({ text: "Nice length and girth but can you last long though? #RealTalk" })}
                    else if((ppsize == "8D" && ballsize == "Huge") || (ppsize == "8=D" && ballsize == "Huge") || (ppsize == "8==D" && ballsize == "Huge")) {ppsizeembed.setFooter({ text: "You’re gonna have some trouble getting laid, huge balls yet little to no cock. How much can you cum?" })}
                    else if(ballsize == "HUMONGOUS ASS BALLS") {ppsizeembed.setFooter({ text: "Can't say about cock but holy shit Nice balls N!gga 😋🍴" })}
                    else if(ppsize == "8D") {ppsizeembed.setFooter({ text: "You're not really faring well...Especially in the cock part 😬" })}
                    else if(ppsize == "8================D") {ppsizeembed.setFooter({ text: "Nice cock chief 😍" })}
                    else if(ballsize == "Non-existent") { ppsizeembed.setFooter({ text: "Bitch where'd your balls go?????????" })}
                    else if(ppsize == "No cock 😱") { ppsizeembed.setFooter({ text: "Yo...umm...you don't even have a dick to begin with 😭" })}
                    else {ppsizeembed.setFooter({ text: foot })}
                    return msg.channel.send({ embeds: [ppsizeembed] })
                }
            }
            else{
                // If no one is tagged !
                const ppsizeembed = new MessageEmbed()
                    .setTitle("🍆 Dick Size Calculator")
                    .setColor("BLUE")
                    .setDescription(`**User :** ${interaction.member!.user}`)
                    .addFields({
                        name: `D-Size :`,
                        value: `\`\`\`${ppsize}\`\`\``,
                        inline: true
                    },
                        {
                            name: `Balls :`,
                            value: `\`\`\`${ballsize}\`\`\``,
                            inline: true
                        })
                
                if(ballsize == "Non-existent" && ppsize == "No cock 😱") {ppsizeembed.setFooter({ text: `There is literally nothing there, what are you showing me? You actually have no cock or balls 😐` })}
                
                else if(ballsize == "HUMONGOUS ASS BALLS" && ppsize == "8================D") {ppsizeembed.setFooter({ text: "You have the greatest cock and balls known to man, your cock and balls were created by the finest sculptors to ever walk the earth. From the balls to the shaft to the tip there is not a single flaw, both the cock and balls are huge which come together to cause a symphony of pleasure to whoever you’re with. You are truly blessed." })}
                else if(ppsize == "8=============D" || ppsize == "8===========D" || ppsize == "8===============D") {ppsizeembed.setFooter({ text: "Nice length and girth but can you last long though? #RealTalk" })}
                else if((ppsize == "8D" && ballsize == "Huge") || (ppsize == "8=D" && ballsize == "Huge") || (ppsize == "8==D" && ballsize == "Huge")) {ppsizeembed.setFooter({ text: "You’re gonna have some trouble getting laid, huge balls yet little to no cock. How much can you cum?" })}
                else if(ballsize == "HUMONGOUS ASS BALLS") {ppsizeembed.setFooter({ text: "Can't say about cock but holy shit Nice balls N!gga 😋🍴" })}
                else if(ppsize == "8D") {ppsizeembed.setFooter({ text: "You're not really faring well...Especially in the cock part 😬" })}
                else if(ppsize == "8================D") {ppsizeembed.setFooter({ text: "Nice cock chief 😍" })}
                else if(ballsize == "Non-existent") { ppsizeembed.setFooter({ text: "Bitch where'd your balls go?????????" })}
                else {ppsizeembed.setFooter({ text: foot })}

                return msg.channel.send({ embeds: [ppsizeembed] })
            }
        }
        else if(choice === "gaymeter"){
            const msg = await interaction.reply({ content: "Find how much gay someone is 😲 (Tag them!) ", fetchReply: true }) as Message;
            const random = Math.floor(Math.random() * 100);
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);
            
            if(!result || result.size === 0) return msg.edit({ content: "You too long enough." })

            const memberz = result.first()?.mentions.members?.first() ?? (interaction.member as GuildMember);
            if(!memberz || memberz.user.id === interaction.user.id ) {
                const embed = new MessageEmbed()
                    .setTitle("How gay are you?")
                    .setColor("RANDOM")
                    .setDescription(`👉 You're **${random}%** Gay 🏳‍🌈🏳‍🌈`)

                if(random === 0) { embed.setFooter({ text: "YOU'RE STRAIGHT! LET'S F*CKING GOOOOOOOOOOOO!" })
                    embed.setThumbnail("https://i.imgur.com/bjvaYon.jpg")
                }
                else if(random === 100) { embed.setFooter({ text: "Stop being a 🤡" })
                    embed.setThumbnail("https://i.imgur.com/UogM8iG.gif")
                }
                else { embed.setThumbnail("https://media.tenor.com/images/a703b26d10a46b6c65987f4c7441181d/tenor.gif") }
                await  msg.channel.send({ embeds: [embed] });
                return msg.edit({ content: "Interaction completed." }).catch(() => null);

            }
        }
        else if(choice === "hornymeter"){
            const msg = await interaction.reply({ content: "Find how much horny someone is 😋 ( Tag them!) ", fetchReply: true }) as Message;
            const random = Math.floor(Math.random() * 10);
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);

            if(!result || result.size === 0) return msg.edit({ content: "You too long enough." })
            const memberz = result.first()?.mentions.members?.first() ?? (interaction.member as GuildMember);

            if(!memberz || memberz.user.id === interaction.user.id) {
                const embed = new MessageEmbed()
                    .setTitle("How HORNY are you?🤤")
                    .setColor("RANDOM")
                    .setDescription(`👉 You're **${random}**/10 Horny <a:HelpingYourself:754330635656626246>`)
                    .setThumbnail("https://i.imgur.com/nqc73YS.gif");

                if(random === 0) { embed.setFooter({ text: "You've defeated the HORNY and achieved the HAPPY" })}
                if(random === 10) { embed.setFooter({ text: "Oh heavens! HORNY TOOK OVER YOU NOOOOOOO!!😨😨" })}

                 msg.channel.send({ embeds: [embed] });
            }

            if(memberz.id === "179911663586246656" || memberz.id === "179911663586246656") {
                const embed = new MessageEmbed()
                    .setTitle("How HORNY are you?🤤")
                    .setColor("RANDOM")
                    .setDescription(`👉 ${memberz.user} is 100/100 Horny <a:HelpingYourself:754330635656626246><a:HelpingYourself:754330635656626246>`)
                    .setThumbnail("https://i.imgur.com/nqc73YS.gif");
                embed.setFooter({ text: "Oh heavens! he's Horny NOOOOOOOOOOOO!!😨😨" })

                msg.channel.send({ embeds: [embed] });
            }


            else {
                const embed = new MessageEmbed()
                    .setTitle("How HORNY are you?🤤")
                    .setColor("RANDOM")
                    .setDescription(`👉 ${memberz.user} a **${random}**/10 Horny <a:HelpingYourself:754330635656626246>`)
                    .setThumbnail("https://i.imgur.com/nqc73YS.gif");

                if(random === 0) { embed.setFooter({ text: "You've defeated the HORNY and achieved the HAPPY" })}
                if(random === 10) { embed.setFooter({ text: "Oh heavens! HORNY HAS TAKEN OVER YOU NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!😨😨" })}

                msg.channel.send({ embeds: [embed] });
            }

            return msg.edit({ content: "Interaction completed." }).catch(() => null);
        }
        else if(choice === "lovemeter"){
            const msg = await interaction.reply({ content: "Calculates the love affinity you have for another person ( Tag them!)", fetchReply: true }) as Message;
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);

            if(!result || result.size === 0) return msg.edit({ content: "You too long enough." })
            const memberz = result.first()?.mentions.members?.first()
            if(!memberz) return msg.channel.send("Mention a user! or maybe you don't have anyone to love <:WAH:740257222344310805>").then(m => setTimeout(() => m.delete(), 2000));

            if(memberz.id === "596065910868017166") // 596065910868017166 Gorge
            { const ppsizeembed = new MessageEmbed()
                .setTitle(`💘 __**Love Calculator**__ 💘\n`)
                .setColor("#ffb6c1")
                .setDescription(`👉 **${memberz.user.tag}\n👉 Devilish#0001**`)
                .addFields({
                    name: `There's no love to Calculate...`,
                    value: `\n\n\n\n💟 0.00%  **||** 🖤 🖤 🖤 🖤 🖤 **||**`
                },
                    {
                        name: "\u200b",
                        value: `**Result:** \`He has no love to give anyone anymore\`💔`
                    })

                return msg.channel.send({ embeds: [ppsizeembed] })
            }

            //If you tag yourself
            if(interaction.user.id === memberz.id) {

                const embed = new MessageEmbed()
                    .setTitle(`💘 __**Love Calculator**__ 💘\n`)
                    .setDescription(`👉 **${memberz.displayName}\n👉 ${(interaction.member as GuildMember)!.displayName}**`)
                    .setColor("#ffb6c1")
                    .addFields({
                        name: `Calculating your love.....`,
                        value: `\n\n\n\n💟 101%  **||** ❤️ 🧡 💛 💚 💙 💜 🤍 🤎 🖤 **||**`
                    },
                        {
                         name: "\u200b",
                            value: `**Result:** \`B!tch you better start loving yourself, you're the best there is🥰\``
                        })

                return msg.channel.send({ embeds: [embed] });
            }


            // love is the percentage
            // loveIndex is a number from 0 to 10, based on that love variable

            const love = Math.random() * 100;
            const loveIndex = Math.floor(love / 10);
            const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);


            let res;
            const loveIndexx = Math.floor(love);
            if(loveIndexx===0)res="I have some news for you buddy...This ain't gonna f*cking work in a million years"
            else if(loveIndexx<20)res="Do you even love them?😭"
            else if(loveIndexx<40)res="That doesn't look good😐"
            else if(loveIndexx<60)res="Basically friend-zoned. Cool"
            else if(loveIndexx===69)res="Nice"
            else if(loveIndexx<80)res="Good enough!😁"
            else if(loveIndexx<90)res="Damn y'all look great together🙈"
            else if(loveIndexx<=99)res="Purrrr-fect for each other!😍"
            else if(loveIndexx===100)res="100%?! That's enough love to make a grown man cry...😭💘"

            const embed = new MessageEmbed()
                .setTitle(`💘 __**Love Calculator**__ 💘\n`)
                .setThumbnail("https://i.imgur.com/oS5Rwsc.gif")
                .setDescription(`👉 **${memberz.displayName}\n👉 ${(interaction.member as GuildMember)!.displayName}**`)
                .setColor("#ffb6c1")
                .addFields({
                    name: `Calculating their love.....`,
                    value: `\n\n\n\n💟 ${Math.floor(love)}%  **||**  ${loveLevel}  **||**`
                },
                    {
                        name: "\u200b",
                        value: `**Result:** \`${res}\``
                    })

            msg.channel.send({ embeds: [embed] });
            return msg.edit({ content: "Interaction completed." }).catch(() => null);

        }
        else if(choice === "meme"){

            const msg = await interaction.reply({ content: "<a:FindingNukes:728258193565810778> looking for the funny....", fetchReply: true }) as Message;
            const subReddits = ["memes", "me_irl"];
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];

            const img = await randomPuppy(random);
            const embed = new MessageEmbed()
                .setColor("BLUE")
                .setImage(img)
                .setTitle(`From /r/${random}`)
                .setURL(`https://reddit.com/r/${random}/`)
                .setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

            return msg.channel.send({ embeds: [embed] });
        }
        else if(choice === "roast"){
            const msg = await interaction.reply({ content: "Roast someone (Tag them!) ", fetchReply: true }) as Message;
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);

            if(!result || result.size === 0) return msg.edit({ content: "You too long enough." })
            let User = result.first()?.mentions.members?.first()

            if(!User) User = (interaction.member as GuildMember)!
            fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
                .then(res => res.json()).then(body => {
                if(!body) return msg.channel.send(" whoops. I broke, try again!")

                const embed = new MessageEmbed()
                    .setColor("#8a0303")
                if(User){
                    embed.setDescription(`**${User}, ${body.insult}**`)
                }else {
                    embed.setDescription(`**${interaction.user}, ${body.insult}**`)}

                msg.channel.send({ embeds: [embed] });
                return msg.edit({ content: "Interaction Completed." });
            })
        }
        else if(choice === "thotmeter"){
            const msg = await interaction.reply({ content: "Find how much of a hoe someone is 🙄 ( Tag them! )", fetchReply: true }) as Message;
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);

            if(!result || result.size === 0) return msg.edit({ content: "You too long enough." })
            
            const random = Math.floor(Math.random() * 10);
            const memberz = result.first()?.mentions.members?.first()

            if(!memberz || memberz.user.id === interaction.user.id ) {
                const embed = new MessageEmbed()
                    .setTitle("How much of a hoe are you?")
                    .setColor("#73102e")
                    .setDescription(`👉 You're a **${random}**/10 hoe 💅💁‍♀️`)
                    .setThumbnail("https://media.tenor.com/images/550d9d49acfbb842f1f1365cbce09a5d/tenor.gif");

                if(random === 0) { embed.setFooter({ text: "You really out there 😍😛" })}
                if(random === 10) { embed.setFooter({ text: "You're a professional bad bitch 😪 I hope we never cross ways 💔" })
                }

                msg.channel.send({ embeds: [embed] });
            }
            else {
                const embed = new MessageEmbed()
                    .setTitle("How much of a hoe are you?")
                    .setColor("#73102e")
                    .setDescription(`👉 ${memberz.user} a **${random}**/10 hoe 💅💁‍♀️`)
                    .setThumbnail("https://media.tenor.com/images/550d9d49acfbb842f1f1365cbce09a5d/tenor.gif");

                if(random === 0) { embed.setFooter({ text: "You really out there 😍😛" })}
                if(random === 10) { embed.setFooter({ text: "You're a professional bad bitch 😪 I hope we never cross ways 💔" })}

                msg.channel.send({ embeds: [embed] });
            }
            return msg.edit("Interaction Completed.").catch(() => null);

        }
        else if(choice === "waifumeter"){
            const msg = await interaction.reply({ content: "Find how much of a waifu material someone is 😋 ( Tag them !) ", fetchReply: true }) as Message;
            const result = await msg.channel.awaitMessages({ time: 30_000, filter: filter, max: 1, errors: ['time'] }).catch(() => null);

            if(!result || result.size === 0) return msg.edit({ content: "You too long enough." })
            const memberz = result.first()?.mentions.members?.first()
            
            const random = Math.floor(Math.random() * 10);

            if(!memberz || memberz.user.id===interaction.user.id ) {
                const embed = new MessageEmbed()
                    .setTitle("How much of a Waifu material are you?")
                    .setColor("#f4c2c2")
                    .setDescription(`👉 You're a **${random}**/10 waifu <a:heart_gif:731170667671584860>`)
                    .setThumbnail("https://i.pinimg.com/originals/e6/bb/8a/e6bb8af7bfcb47e639d4e5c09f58a040.gif");

                if(random === 0) { embed.setFooter({ text: "Okay that kinda sucks 😶" })}
                if(random === 10) { embed.setFooter({ text: "You're a special one indeed 😍💓" })}

                msg.channel.send({ embeds: [embed] });
            }

            else {
                const embed = new MessageEmbed()
                    .setTitle("How much of a Waifu material are you?")
                    .setColor("#f4c2c2")
                    .setDescription(`👉 ${memberz.user} a **${random}**/10 waifu <a:heart_gif:731170667671584860>`)
                    .setThumbnail("https://i.pinimg.com/originals/e6/bb/8a/e6bb8af7bfcb47e639d4e5c09f58a040.gif");

                if(random === 0) { embed.setFooter({ text: "Okay that kinda sucks 😶" })}
                if(random === 10) { embed.setFooter({ text: "You're a special one indeed 😍💓" })}

                msg.channel.send({ embeds: [embed] });
            }

            return msg.edit("Interaction Completed.").catch(() => null);
        }

    }
}