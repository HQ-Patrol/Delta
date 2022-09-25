import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, MessageEmbed } from "discord.js";
import { GuildModel } from '../../../database/models/GuildModel';

@ApplyOptions<Command.Options>({
    name: "action",
    description: "Perform an action on someone."
})

export class ActionsCommand extends Command{

    public registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) =>
          builder
            .setName(this.name)
            .setDescription(this.description)
            .setDMPermission(false)


            .addSubcommand((subcommand) => 
            subcommand
                .setName("bite")
                .setDescription("Bite someone!")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )

            .addSubcommand((subcommand) => 
            subcommand
                .setName("boohoo")
                .setDescription("Used when you don't care about what other person said")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand 
                .setName("boop")
                .setDescription("Boop someone!")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )


            .addSubcommand((subcommand) => 
            subcommand
                .setName("cringe")
                .setDescription("When somebody is being cringe😶")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("dap")
                .setDescription("Dap with someone! 🙏")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )

            .addSubcommand((subcommand) => 
            subcommand
                .setName("groom")
                .setDescription("Groom kids :)")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("handshake")
                .setDescription("Shake someone's hands! ")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("highfive")
                .setDescription("Highfive someone! 🖐️")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )


            .addSubcommand((subcommand) => 
            subcommand
                .setName("holdhands")
                .setDescription("Hold hands with someone! 🤝")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("hug")
                .setDescription("Hug someone! 🤗")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("kiss")
                .setDescription("Kiss someone! 💋")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("lick")
                .setDescription("Lick someone! 🤤")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("miss")
                .setDescription("When you miss someone!😔")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("nom")
                .setDescription("Eat someone!")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("pat")
                .setDescription("Pat someone! 🐱")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("piss")
                .setDescription("Piss on someone like a boss 😎")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("rihanna")
                .setDescription("Beat someone up !")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("salute")
                .setDescription("Salute someone!")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName("slap")
                .setDescription("Slap someone! 🤜")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) =>
            subcommand
                .setName("spit")
                .setDescription("Spit on someone! 🤮")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
            .addSubcommand((subcommand) => 
            subcommand 
                .setName("stone")
                .setDescription("Stone someone to death!")
                .addStringOption((option) => 
                    option
                        .setName("userid")
                        .setDescription("userid")
                        .setRequired(false)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription("user")
                        .setRequired(false)
                )
            )
        );
      }

    public async chatInputRun(interaction : ChatInputCommand.Interaction){
        await interaction.deferReply();

        const guild  = await GuildModel.findOne({ _id: interaction.guild?.id }).catch((err : Error)=> console.log(err));
        let chibi;
        if(guild) chibi = guild!.chibi ?? false;

        const subcommand = interaction.options.getSubcommand();

        if(["eatass", "choke", "cum", "fist", "fondle", "peg", "spank", "touch"].includes(subcommand) ) {
            // Check if the Guild is NSFW or not
            if (guild?.nsfw === false) {
                return interaction.editReply({ embeds: [new MessageEmbed().setColor("#660000").setTitle("SFW Mode is ON 🔞").setDescription("<a:exclamation:741988026296696872> Please refrain from using that command as this Server is FAMILY-FRIENDLY 👨‍👩‍👧‍👦").setFooter({ text: "If you think this is a mistake, please contact Admins❗" })] })
            }
        }
            // Get the user/ userid
            const user = interaction.options.getUser("user")
            const userid = interaction.options.getString("userid")

            if(!user) {
                if(!userid){
                    return interaction.editReply({ content: "Please mention a user or user ID correctly! 😐" });
                }
            }

            const member : GuildMember | undefined = user ? interaction.guild?.members.cache.get(user.id) : interaction.guild?.members.cache.get(userid!);

            // Run some checks
            if(!member) return interaction.editReply({ content: "Please mention the USER ID correctly! 😐" });
            //if (member.id === interaction.user.id) { return interaction.editReply({ content: "Time to play with yourself, eh? 💦" }) }

            // Execute and return the response for the sub-commands

            else if(subcommand === "bite"){
                // Bite sub-command
                if (member.id === interaction.user.id) { return interaction.editReply("*Is that some weird kink of yours?*") }

                let random = ["https://i.imgur.com/8cskqqA.gif","https://i.imgur.com/IeMAwXh.gif", "https://i.imgur.com/HnX4rkl.gif", "https://i.imgur.com/CVFMlDH.gif", "https://i.imgur.com/ieECUZW.gif", "https://i.imgur.com/nvtcrRU.gif", "https://i.imgur.com/29t3klp.gif", "https://i.imgur.com/wdNHLZB.gif", "https://i.imgur.com/8NICVEd.gif","https://i.imgur.com/4dwqQ3Y.gif", "https://i.imgur.com/NOfew22.gif","https://i.imgur.com/VYGsthN.gif","https://i.imgur.com/PKqA939.gif", "https://i.imgur.com/GGrD2CK.gif", "https://i.imgur.com/DnOnxai.gif", "https://i.imgur.com/tYOMGqc.gif", "https://i.imgur.com/sG3EKCc.gif", "https://i.imgur.com/JUTQ4fD.gif", "https://i.imgur.com/p2w1z3C.gif", "https://i.imgur.com/X0YTou9.gif", "https://i.imgur.com/JoqLNv8.gif", "https://i.imgur.com/1bI7tkd.gif", "https://i.imgur.com/OmEudTU.gif", "https://i.imgur.com/R55KvbS.gif","https://i.imgur.com/iifr5Hv.gif","https://i.imgur.com/s4o9Sac.gif","https://i.imgur.com/r5lPa1o.gif","https://i.imgur.com/iGT5gvx.gif","https://i.imgur.com/WN9nGzO.gif","https://i.imgur.com/0xou9cb.gif","https://i.imgur.com/83OHx0V.gif","https://i.imgur.com/M7yNTRr.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi) { return interaction.editReply({embeds : [new MessageEmbed().setColor("RANDOM").setThumbnail("https://i.imgur.com/TJuzZMP.gif").setAuthor({name: `${interaction.user.username} bit ${member.user.username} 🤭`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]})}

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`**${interaction.user.username} bit ${member.user}😱**`)
                    .setImage(gif);

                return interaction.editReply({embeds:[embed]});
            }
            else if(subcommand === "boohoo"){
                // Boohoo sub-command

                if (member.id === interaction.user.id) { return interaction.editReply({content: "Matter of fact, nobody cares about you."})}

                let random = ["https://i.imgur.com/7R1p62H.jpg","https://i.imgur.com/GMESSBh.jpg"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi) { return interaction.editReply({embeds : [new MessageEmbed().setColor("RANDOM").setThumbnail("https://i.imgur.com/M4UUcG5.png").setAuthor({name: `🤡 Boohoo ${member.user.username} STFU 🤡`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]})}

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `🤡 Boohoo son STFU 🤡`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setDescription(`${member.user} keep in mind that ${interaction.user} doesn't frickin' care!😭 *or literally anyone else either*`)
                    .setImage(gif);

                return interaction.editReply({embeds:[embed]});
            }
            else if(subcommand === "boop"){

                if (member.id === interaction.user.id) { return interaction.editReply({content : "Boop!"}) }
                let random = ["https://i.imgur.com/kWNRhN7.gif","https://i.imgur.com/xMK1NKs.gif","https://i.imgur.com/msH7c4b.gif","https://i.imgur.com/Ash1diR.gif","https://i.imgur.com/PcsR99q.gif","https://i.imgur.com/7XtYd2O.gif","https://i.imgur.com/TFVPa38.gif","https://i.imgur.com/s2wdqAh.gif","https://i.imgur.com/hbXDVRx.gif","https://i.imgur.com/8mmWOZ4.gif","https://i.imgur.com/QMjfO9T.gif","https://i.imgur.com/dWKRsi9.gif","https://i.imgur.com/2m1QvZT.gif","https://i.imgur.com/NOsj6ad.gif","https://i.imgur.com/VtNS7Eo.gif","https://i.imgur.com/pqKCPsw.gif","https://i.imgur.com/yWcHC7k.gif","https://i.imgur.com/ehWTZKo.gif","https://i.imgur.com/D5GyZDs.gif","https://i.imgur.com/uFqcLDP.gif","https://i.imgur.com/tBmWEWq.gif", "https://i.imgur.com/qoN2Y26.gif", "https://i.imgur.com/cRBXmN2.gif", "https://i.imgur.com/AWlNxKo.gif", "https://i.imgur.com/GUKBjZM.gif", "https://i.imgur.com/JLWX2ja.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/1ETp9wh.gif")
                        .setDescription(`${interaction.user} booped ${member.user} 👈`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`${interaction.user} booped ${member.user} 👈`)
                    .setImage(gif);

                return interaction.editReply({embeds:[embed]});
            }
            else if(subcommand === "brofist"){
                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`${interaction.user} 🤜🤛 ${member.user}`)

                return interaction.editReply({embeds:[embed]});
            }

            else if(subcommand === "cringe"){
                if (member.id === interaction.user.id) { return interaction.editReply("Stop attention seeking retard...") }

                let random = ["https://i.imgur.com/JM4QHwl.gif","https://i.imgur.com/ZycgsS4.gif", "https://i.imgur.com/Skz0aZu.gif",
                    ,"https://i.imgur.com/AsEVB19.gif","https://i.imgur.com/BEBfh48.gif","https://i.imgur.com/nOkH1u0.gif","https://i.imgur.com/WKSe4d4.gif","https://i.imgur.com/79b814W.gif",
                    "https://i.imgur.com/EBLaJ4i.gif","https://i.imgur.com/374KdmE.gif","https://i.imgur.com/a2J9JEQ.gif","https://i.imgur.com/Nwcd5O5.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/Bb1wv6k.gif")
                        .setDescription(`${member.user}...Dude, STOP. That's just cringy...Please 😶 `)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} wants you to stop, please.`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `‼️ CRINGE METER GOING WILD ‼️`})
                    .setDescription(`${member.user}...Dude, STOP. That's just cringy...Please 😶 `)
                    .setImage(`${gif!}`);

                return interaction.editReply({embeds: [embed]});
            }

            else if(subcommand === "dap"){
                
                let random = ["https://i.imgur.com/B9eeEyN.gif","https://i.imgur.com/SSWU5Kz.gif","https://i.imgur.com/WuHlEsR.gif","https://i.imgur.com/mDKwmm5.gif",
                    "https://i.imgur.com/tD9x19K.gif","https://i.imgur.com/x6XM5G7.gif","https://i.imgur.com/uaDzuZq.gif",
                    "https://i.imgur.com/V0hcu5t.gif","https://i.imgur.com/WF0vn44.gif","https://i.imgur.com/vK05ebR.gif","https://i.imgur.com/LH6C8Ff.gif",
                    "https://i.imgur.com/lvmBVsZ.gif","https://i.imgur.com/YrYb2Le.gif","https://i.imgur.com/GigSI8J.gif","https://i.imgur.com/QJ9pMmI.gif",
                    "https://i.imgur.com/a6aspvG.gif","https://i.imgur.com/HhbHiaf.gif","https://i.imgur.com/zUDxOQY.gif","https://i.imgur.com/xnkpvch.gif",
                    "https://i.imgur.com/gAtBWEb.gif","https://i.imgur.com/wlQXrnB.gif","http://i.imgur.com/fkgKkMZh.gif","https://i.imgur.com/BFgR6tu.gif",
                    "https://i.imgur.com/r2ebM1k.gif","https://i.imgur.com/FHyxxXM.gif","https://i.imgur.com/3DnrR2P.gif","https://i.imgur.com/bS1Df8h.gif",
                    "https://i.imgur.com/N8JbD1Z.gif","https://i.imgur.com/Uct9CEu.gif","https://i.imgur.com/RpfB6az.gif","https://i.imgur.com/Wrw0Abh.gif","https://i.imgur.com/k2lGBSJ.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { return interaction.editReply({content : "*Epic lonely person moment....*"}) }
                
                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/cWs34Fa.gif")
                        .setAuthor({name: `${interaction.user.username} dapped ${member.user.username} 🤝🤜🤛🤝`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} dapped ${member.user.username} 🤝🤜🤛🤝`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }


            else if(subcommand === "groom"){
                // Groom sub-command

                const sender = interaction.member as GuildMember;
                if(!sender.permissions.has("KICK_MEMBERS") && !sender.permissions.has("BAN_MEMBERS") && !sender.permissions.has("MANAGE_MESSAGES")) {
                    return interaction.editReply({content : "Only Discord Moderators can use this command"})
                }

                let random = ["https://i.imgur.com/jq2Oewm.gif","https://i.imgur.com/KyzTPvZ.gif","https://i.imgur.com/VAC8WRZ.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { return interaction.editReply("😕") }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/UCGSTp0.gif")
                        .setAuthor({name: `${interaction.user.username} tried to groom ${member.user.username} 💋💏🤤`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} tried to groom ${member.user.username} 💋💏🤤`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: 'This reminds me of Discord Devs...'})
                    .setImage(gif);

                return interaction.editReply({embeds:[embed]});

                // TODO : Add the Weekly Mission part once types are fixed.
            }
            else if(subcommand === "handshake"){

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`${interaction.user}<:HorseHeadRight:751058262753017878>🤝<:HorseHeadLeft:751058242477621278>${member.user}`)

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "highfive"){

                let random = ["https://media0.giphy.com/media/5wWf7GW1AzV6pF3MaVW/giphy.gif","https://thumbs.gfycat.com/AliveThirstyEidolonhelvum-size_restricted.gif"
                    ,"https://media2.giphy.com/media/yZWsMXuXP9e5a/200.gif","https://media0.giphy.com/media/3oEjHV0z8S7WM4MwnK/giphy.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { return interaction.editReply("*That's just some lonely ass shit....*") }
                
                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/hHqhRPb.gif")
                        .setAuthor({name: `${interaction.user.username} highfived ${member.user.username} 🙏`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} highfived ${member.user.username} 🙏`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});

            }
            else if(subcommand === "holdhands"){

                let random = ["https://i.imgur.com/HHPJmXp.gif","https://i.imgur.com/vxcDPSW.gif","https://i.imgur.com/yALr0sW.gif","https://i.imgur.com/aIXiCsc.gif","https://i.imgur.com/G3WcvBD.gif","https://i.imgur.com/QzkwSpE.gif","https://i.imgur.com/nrzC4BR.gif","https://i.imgur.com/vKEEn6A.gif","https://i.imgur.com/kOe3BGP.gif","https://i.imgur.com/El0Gjw4.gif","https://i.imgur.com/6tgtYXw.gif","https://i.imgur.com/mvpGpRs.gif","https://i.imgur.com/1rDRfW0.gif","https://i.imgur.com/4wsXexl.gif","https://i.imgur.com/621zmbL.gif","https://i.imgur.com/HBuM7DW.gif","https://i.imgur.com/BUNUp7w.gif","https://i.imgur.com/rbWd98d.gif",
                    "https://i.imgur.com/IdWdJGC.gif", ""]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) {
                    let embed1 = new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor({name: `You don't need anyone else when you got yourself! 😎`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                        .setImage("https://i.imgur.com/ztqJryF.gif");

                    return interaction.editReply({embeds: [embed1]}) }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/KbfPd2v.gif")
                        .setDescription(`**${interaction.user.username} is holding ${member.user} close♥🥰**`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`**${interaction.user.username} is holding ${member.user} close♥🥰**`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "hug"){
                let random = ["https://i.imgur.com/FzvNzgT.gif","https://i.imgur.com/NPExZF2.gif","https://i.imgur.com/Ozy5SkQ.gif","https://i.imgur.com/zM8rP72.gif","https://i.imgur.com/2InQXIe.gif","https://i.imgur.com/yJWwVRR.gif","https://i.imgur.com/pGxoZvV.gif","https://i.imgur.com/jaFfM54.gif","https://i.imgur.com/kEKfhjB.gif","https://i.imgur.com/xO6h0Fq.gif","https://i.imgur.com/SMbQIYJ.gif","https://i.imgur.com/kQa7FaZ.gif","https://i.imgur.com/oBPpCOS.gif","https://i.imgur.com/rFwIET9.gif","https://i.imgur.com/jptuYJx.gif","https://i.imgur.com/MnDGVeY.gif","https://i.imgur.com/hkGsdka.gif","https://i.imgur.com/71KLYnZ.gif","https://i.imgur.com/yL6q3XK.gif","https://i.imgur.com/HRyYhvO.gif","https://i.imgur.com/rNWWmNy.gif","https://i.imgur.com/IBY3ACc.gif", "https://i.imgur.com/G7z7fSK.gif","https://i.imgur.com/7w8JBw1.gif","https://i.imgur.com/h2smpTN.gif","https://i.imgur.com/3l5Mo7N.gif","https://i.imgur.com/1vdCVzI.gif","https://i.imgur.com/mlWjHK0.gif","https://i.imgur.com/GrL46tD.gif","https://i.imgur.com/8XoLfZi.gif","https://i.imgur.com/jJLQ6dp.gif","https://i.imgur.com/dBodV3c.gif","https://i.imgur.com/ziMUgEF.gif", "https://i.imgur.com/mrY3bQt.gif","https://i.imgur.com/CPZWR0L.gif","https://i.imgur.com/FNQ6O49.gif","https://i.imgur.com/7H6CyYn.gif",
                    "https://i.imgur.com/4MJ9DrW.gif","https://i.imgur.com/72IoE7R.gif","https://i.imgur.com/s6sr4lW.gif","https://i.imgur.com/uVU3xQc.gif","https://i.imgur.com/wbFHHyn.gif","https://i.imgur.com/YpRUAOH.gif","https://i.imgur.com/fUpsLxV.gif", "https://i.imgur.com/OLnI5mG.gif","https://i.imgur.com/lKXrp3a.gif","https://i.imgur.com/zNCctw6.gif","https://i.imgur.com/JNactKX.gif","https://i.imgur.com/eEPrGUL.gif","https://i.imgur.com/TRL8bPF.gif","https://i.imgur.com/CccWii8.gif","https://i.imgur.com/2jh8KpC.gif","https://i.imgur.com/PEFyyvf.gif","https://i.imgur.com/dKR715q.gif","https://i.imgur.com/8jVVG5C.gif",
                    "https://i.imgur.com/kv5feWF.gif","https://i.imgur.com/hPnQ8UL.gif","https://i.imgur.com/6atNrut.gif","https://i.imgur.com/uwl4WIt.gif","https://i.imgur.com/saCTXF0.gif","https://i.imgur.com/asDCpk3.gif","https://i.imgur.com/dzx4PeB.gif","https://i.imgur.com/HoXDK5X.gif","https://i.imgur.com/HfWJwLn.gif","https://i.imgur.com/iUiDUGC.gif","https://i.imgur.com/9uHap1W.gif","https://i.imgur.com/ngGm9v9.gif","https://i.imgur.com/DScGTM6.gif","https://i.imgur.com/KrYnQzR.gif","https://i.imgur.com/G2DLX6i.gif",
                    "https://i.imgur.com/AR5lGeu.gif", "https://i.imgur.com/S8zfMuG.gif", "https://i.imgur.com/jb1J35S.gif", "https://i.imgur.com/h7NwBj0.gif", "https://i.imgur.com/9KkFllf.gif", "https://i.imgur.com/PlT5XyQ.gif", "https://i.imgur.com/DLFCkJh.gif", "https://i.imgur.com/sjfaODW.gif", "https://i.imgur.com/NyUCrKm.gif", "https://i.imgur.com/wWEXlWc.gif", "https://i.imgur.com/uTpxiVC.gif", "https://i.imgur.com/XxQHPjT.gif", "https://i.imgur.com/KJb5lgN.gif", "https://i.imgur.com/TIiBUbx.gif", "https://i.imgur.com/oODLblv.gif", "https://i.imgur.com/UAWLTPs.gif", "https://i.imgur.com/qbd49XY.gif", "https://i.imgur.com/GijPJZi.gif", "https://i.imgur.com/c5csOSA.gif", "https://i.imgur.com/EJlRwpI.gif", "https://i.imgur.com/TsEQzGg.gif", "https://i.imgur.com/r9GgnYJ.gif", "https://c.tenor.com/4n3T2I239q8AAAAC/anime-cute.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) {
                    let embed1 = new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor({name: `Looks like you're pretty lonely rn😭 Here, have a hug <3`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                        .setImage(gif);

                    return interaction.editReply({embeds: [embed1]}) }

                
                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/93lQXig.gif")
                        .setAuthor({name: `${interaction.user.username} hugged ${member.user.username}!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} hugged ${member.user.username}!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "kiss"){

                let random = ["https://i.imgur.com/HSnUwLW.gif","https://i.imgur.com/hPqjCj5.gif","https://i.imgur.com/MKjtpQH.gif","https://i.imgur.com/aNuEGYc.gif","https://i.imgur.com/updPPc2.gif","https://i.imgur.com/n7TsiwD.gif","https://i.imgur.com/8V4TOHT.gif","https://i.imgur.com/nxw47C4.gif","https://i.imgur.com/kmJrG43.gif","https://i.imgur.com/xghqM1W.gif","https://i.imgur.com/WI93tF2.gif","https://i.imgur.com/SBksvWT.gif","https://i.imgur.com/aM1O7s0.gif","https://i.imgur.com/17Q5aqH.gif","https://i.imgur.com/HOfG0zd.gif","https://i.imgur.com/eNpIzKb.gif","https://i.imgur.com/ACrxaVj.gif","https://i.imgur.com/A7wwrnB.gif","https://i.imgur.com/yoh5vXv.gif","https://i.imgur.com/TPDS2Xx.gif","https://i.imgur.com/qtLJEgU.gif","https://i.imgur.com/XBkq25C.gif","https://i.imgur.com/N5UY23E.gif","https://i.imgur.com/XFcWqGZ.gif","https://i.imgur.com/14BOJAx.gif","https://i.imgur.com/wc7RSFb.gif","https://i.imgur.com/D3udRSu.gif","https://i.imgur.com/iK3YLmy.gif","https://i.imgur.com/B6TfWc0.gif","https://i.imgur.com/dwQHstB.gif","https://i.imgur.com/rWhxKAs.gif","https://i.imgur.com/KB0CcZu.gif","https://i.imgur.com/OWe94O6.gif", "https://i.imgur.com/iS9Vbyg.gif",
                    "https://i.imgur.com/0Xw6ocK.gif", "https://i.imgur.com/xat4PLB.gif", "https://i.imgur.com/PMtYWPt.gif", "https://i.imgur.com/Hk5a5JZ.gif", "https://i.imgur.com/oNGxGVY.gif", "https://i.imgur.com/4SQkY4X.gif", "https://i.imgur.com/77hjkIs.gif", "https://i.imgur.com/EfRUy3B.gif", "https://i.imgur.com/TOgOBov.gif", "https://i.imgur.com/fcByhMN.gif", "https://i.imgur.com/YgOx7Cl.gif", "https://i.imgur.com/Z30WosW.gif", "https://i.imgur.com/cE0Ba0t.gif", "https://i.imgur.com/BOQ1FE8.gif", "https://i.imgur.com/qVbMdvK.gif", "https://i.imgur.com/eavt6xR.gif", "https://i.imgur.com/nTGfcKQ.gif", "https://i.imgur.com/9lpOUlA.gif", "https://i.imgur.com/0Nw1zOu.gif", "https://i.imgur.com/xC99a1n.gif", "https://i.imgur.com/RFRL01r.gif", "https://i.imgur.com/fQx9K0D.gif", "https://i.imgur.com/3iRzyZc.gif", "https://i.imgur.com/XEWS9pn.gif", "https://i.imgur.com/QcM6TOU.gif", "https://i.imgur.com/9zHTd6w.gif", "https://i.imgur.com/sg21mZX.gif", "https://i.imgur.com/R4Qr2lr.gif", "https://i.imgur.com/MllyiZ9.gif", "https://i.imgur.com/59wVS78.gif", "https://i.imgur.com/S34jrOG.gif", "https://i.imgur.com/lAIJJs0.gif", "https://i.imgur.com/2dME4IU.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) {
                    let embed1 = new MessageEmbed()
                        .setColor("BLUE")
                        .setDescription(`Looks like you're pretty lonely rn😭 Here, have a *robotic* kiss <a:heart_gif:731170667671584860>`)
                        .setImage(gif);

                    return interaction.editReply({embeds: [embed1]}) }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/Jqr2DNu.gif")
                        .setAuthor({name: `${interaction.user.username} kissed ${member.user.username}😳`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} kissed ${member.user.username}😳`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "lick"){

                if (member.id === interaction.user.id) { return interaction.editReply("Okay....") }

                let random = ["https://i.imgur.com/DulOC6q.gif","https://i.imgur.com/hVYTqNZ.gif","https://i.imgur.com/QJVMdS7.gif","https://i.imgur.com/ZfGEfKu.gif","https://i.imgur.com/BzF2cAv.gif","https://i.imgur.com/cuxbkAe.gif","https://i.imgur.com/5GDmCsU.gif","https://i.imgur.com/MxJ8y6m.gif","https://i.imgur.com/Tjj4olG.gif","https://i.imgur.com/zvUDLMY.gif","https://i.imgur.com/mYgU3wF.gif","https://i.imgur.com/M9cbFZC.gif","https://i.imgur.com/Ganlsr7.gif","https://i.imgur.com/x9rB002.gif","https://i.imgur.com/i2CPn8m.gif","https://i.imgur.com/GqCRIAf.gif","https://i.imgur.com/QoPNBzA.gif","https://i.imgur.com/vi8j4LE.gif","https://i.imgur.com/oTNPWrk.gif","https://i.imgur.com/9P6obXl.gif","https://i.imgur.com/VdusGj2.gif","https://i.imgur.com/tJCtu7F.gif","https://i.imgur.com/Z8i24pX.gif","https://i.imgur.com/oXWYZXp.gif","https://i.imgur.com/3e6apgG.gif","https://i.imgur.com/4Avj32H.gif","https://i.imgur.com/sCtl7a7.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/aeDZ3KZ.gif")
                        .setAuthor({name: `${member.user.username} you have been licked by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${member.user.username} you have been licked by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "miss"){
                if (member.id === interaction.user.id) { return interaction.editReply("So umm...You're missing yourself? Missing a PART of yourself?? Missing your Old-self or sum rhetorical shit?? Well, regardless of that...Shut the f*ck up (^_^)") }

                let random = ["https://i.imgur.com/KBD24XO.gif",
                    "https://i.imgur.com/U6xfMmS.gif","https://i.imgur.com/OOlMGYF.gif",
                    "https://i.imgur.com/i8f4PdH.gif","https://i.imgur.com/Np3XFUa.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/TRrfoUF.gif")
                        .setAuthor({name: `${interaction.user.username} do be missing you ${member.user.username}🥺`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} do be missing you🥺`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setDescription(`😭 COME BACK ALREADY! 😭`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "nom"){

                let random = ["https://i.imgur.com/KXLgu3U.gif","https://i.imgur.com/qEV05FR.gif","https://i.imgur.com/5D3Zehm.gif","https://i.imgur.com/FePeo5P.gif","https://i.imgur.com/g09iPmP.gif","https://i.imgur.com/51I4CRR.gif","https://i.imgur.com/lyFeBmU.gif","https://i.imgur.com/fC9TQZv.gif","https://i.imgur.com/7u7XLSC.gif", "https://i.imgur.com/I4b3TIB.gif", "https://i.imgur.com/9uooEDg.gif", "https://i.imgur.com/FnFNDIw.gif", "https://i.imgur.com/rN4krnF.gif", "https://i.imgur.com/Rtinm9O.gif", "https://i.imgur.com/9uOaukP.gif", "https://i.imgur.com/J84KmgN.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { return interaction.editReply("*Is that some weird kink of yours?*") }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/paB28GJ.gif")
                        .setAuthor({name: `${member.user.username} tastes kinda good 🤤`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${member.user.username} tastes kinda good 🤤`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "pat"){

                if (member.id === interaction.user.id) { return interaction.editReply("Here's a little pat on the back for you! ||https://media1.giphy.com/media/l1KVbGDWxVr5qw7M4/200.gif||") }

                let random = ["https://i.imgur.com/BZwu9xs.gif","https://i.imgur.com/ZPK0pnr.gif","https://i.imgur.com/7d6SboR.gif","https://i.imgur.com/v8W0oaI.gif","https://i.imgur.com/5bBuhsz.gif", "https://i.imgur.com/DuLxboy.gif","https://i.imgur.com/XG9DEb4.gif", "https://i.imgur.com/Q21F6hL.gif","https://i.imgur.com/FSKEV6y.gif","https://i.imgur.com/3jh73N9.gif", "https://i.imgur.com/dIpueaF.gif","https://i.imgur.com/zbBKbEK.gif", "https://i.imgur.com/srFk5FJ.gif","https://i.imgur.com/AVs0PkT.gif","https://i.imgur.com/LNr8IaB.gif", "https://i.imgur.com/yZpQ6iJ.gif","https://i.imgur.com/piKhFMd.gif", "https://i.imgur.com/T7VUukQ.gif","https://i.imgur.com/SGhbs0G.gif", "https://i.imgur.com/kJMEuB1.gif", "https://i.imgur.com/Ng6VAsg.gif","https://i.imgur.com/tvluDaI.gif","https://i.imgur.com/gHFMg0f.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/5hIduuC.gif")
                        .setAuthor({name: `${interaction.user.username} just patted ${member.user.username}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} just patted you!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setDescription(`<a:ablob_pat:743858227242074256> PAT PAT PAT PAT <a:ablob_pat:743858227242074256>`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }

            else if(subcommand === "piss"){

                if (member.id === interaction.user.id) { return interaction.editReply("That's just f*cking gross. Stop.") }

                let random = ["https://i.imgur.com/3VZl4lw.gif","https://i.imgur.com/3TiSin2.gif","https://i.imgur.com/DFgpBwW.gif","https://i.imgur.com/cIRswoB.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/ahhhFNh.gif")
                        .setDescription(`${interaction.user} Just pissed on ${member.user} 🤮🤮 Lowkey gross.`)]}) }

                let embed = new MessageEmbed()
                    .setColor("#FFFF00")
                    .setAuthor({name: `${interaction.user.username} Just pissed on you!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `Don't get caught pissing on kids....`})
                    .setDescription(`${interaction.user} Just pissed on ${member.user} 🤮🤮 Lowkey gross.`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "rihanna"){

                if (member.id === interaction.user.id) { return interaction.editReply("You rn😐\n https://i.imgur.com/hPMJO5n.gif") }

                let random = ["https://i.imgur.com/ton33ZY.gif","https://i.imgur.com/HoDn4dR.gif","https://i.imgur.com/FDnYzAZ.gif","https://i.imgur.com/8mqsqja.gif","https://i.imgur.com/NyaPXlh.gif","https://i.imgur.com/Abzwsy5.gif","https://i.imgur.com/oYqFFw0.gif","https://i.imgur.com/l5z2eSA.gif","https://i.imgur.com/RxlR5al.gif","https://i.imgur.com/u55xb7c.gif","https://i.imgur.com/9ljEWZQ.gif","https://i.imgur.com/nFnSSb9.gif","https://i.imgur.com/SY6rXpR.gif","https://i.imgur.com/Z1ZUyFb.gif","https://i.imgur.com/6VMqiPB.gif","https://i.imgur.com/KNwyf2U.gif","https://i.imgur.com/YNibUsH.gif","https://i.imgur.com/dKyApsJ.gif","https://i.imgur.com/E2YKEEN.gif","https://i.imgur.com/qxLvfje.gif","https://i.imgur.com/1AT9Mns.gif","https://i.imgur.com/AyuPGj2.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/iHr5mTn.gif")
                        .setAuthor({name: `${interaction.user.username} just beat the shit out of ${member.user.username}!🤬`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} just beat the shit out of you!🤬`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `Somebody help the poor soul 😨 `})
                    .setDescription(`${interaction.user} is going absolute apeshit on ${member.user}!!😱😱`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "salute"){

                let random = ["https://i.imgur.com/UyeDQIg.gif","https://i.imgur.com/wKLKtuQ.gif","https://i.imgur.com/RIw7A45.gif","https://i.imgur.com/IHLwOr3.gif","https://i.imgur.com/2fuRM4z.gif","https://i.imgur.com/nibPLjN.gif","https://i.imgur.com/PEsrovO.gif","https://i.imgur.com/iVcdQuB.gif","https://i.imgur.com/N8DCB6w.gif","https://i.imgur.com/NdrI6xy.gif","https://i.imgur.com/JtiT87A.gif","https://i.imgur.com/PRtgGkt.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/sxgGcy0.gif")
                        .setDescription(`${interaction.user} Salutes ${member.user} for being awesome 🙌😎🙌`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `😎You're amazing chief😎`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setDescription(`${interaction.user} Salutes ${member.user} for being awesome 🙌🙌`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "slap"){

                let random = ["https://i.imgur.com/or4Xmwd.gif","https://i.imgur.com/a0YrXIL.gif","https://i.imgur.com/VvgP8kn.gif","https://i.imgur.com/NQ95wku.gif","https://i.imgur.com/kkMvuFD.gif","https://i.imgur.com/5zBdvL0.gif","https://i.imgur.com/MEZSBlL.gif","https://i.imgur.com/npq72Xj.gif","https://i.imgur.com/rFQ1m2d.gif","https://i.imgur.com/2aUV1Z6.gif","https://i.imgur.com/rLGUaUV.gif","https://i.imgur.com/fwVEylF.gif","https://i.imgur.com/u8I7PCM.gif","https://i.imgur.com/IEyASf9.gif","https://i.imgur.com/sEOKzAR.gif","https://i.imgur.com/C4a1o4i.gif","https://i.imgur.com/TZ4az8M.gif","https://i.imgur.com/edk98xN.gif","https://i.imgur.com/eTlHsFq.gif","https://i.imgur.com/g3QYRxo.gif","https://i.imgur.com/0h1wsiK.gif","https://i.imgur.com/ChaWUk9.gif",]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/Us1wSe4.gif")
                        .setDescription(`${interaction.user} slapped ${member.user} pretty hard👋😓`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`${interaction.user} slapped ${member.user} pretty hard👋😓`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }


            else if(subcommand === "spit"){

                let random = ["https://i.imgur.com/ZlT3XPW.gif","https://i.imgur.com/wjPXLHb.gif","https://i.imgur.com/QMuJSSf.gif",
                    "https://i.imgur.com/3Xi1lLC.gif","https://i.imgur.com/1qRuFrT.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { return interaction.editReply("So, you're basically accepting that you're a pathetic loser? Touché") }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/B2MKzu5.gif")
                        .setAuthor({name: `${interaction.user.username} is spitting on ${member.user.username} 💦`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} is spittin!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `${member.user.username} disgusts me...`})
                    .setDescription(`Not bars, but rather on ${member.user} 💦`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
            else if(subcommand === "stone"){

                if (member.id === interaction.user.id) { return interaction.editReply("no.") }

                let random = ["https://i.imgur.com/V240YPV.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/rqXtijO.gif")
                        .setAuthor({name: `Oh no!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                        .setDescription(`${interaction.user} STONED ${member.user} to DEATH!!☠☠`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} wants to stone you!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `Stop being an infidel😡`})
                    .setDescription(`${interaction.user} STONED ${member.user} to DEATH!!☠☠`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }


        }

}

// Handling for sub-commands that were excluded !

/*

            if(subcommand === "eatass"){
                // "eatass" sub-command
                if (member.id === interaction.user.id) { return interaction.editReply({ content: "Not humanly possible, but I still appreciate the effort (^_^)"}) }
                if(chibi) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RANDOM").setThumbnail("https://i.imgur.com/XCvXV4A.gif").setDescription(`${interaction.user} ate ${member.user}'s butt😳🍑`)] })

                let random = ["https://i.imgur.com/vrEjpXJ.gif","https://i.imgur.com/OhmCmdc.gif","https://i.imgur.com/uWgxuc3.gif","https://i.imgur.com/dDvIzhk.gif","https://i.imgur.com/wnhD9qg.gif","https://i.imgur.com/ddQBzhL.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                const embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} tried something😛`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `Did it taste good doe?`})
                    .setDescription(`${interaction.user} ate ${member.user}'s butt😳🍑`)
                    .setImage(gif);

                return interaction.editReply({embeds : [embed]});
            }

// Beer sub-command

else if(subcommand === "beer"){

                // Beer sub-command
                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`**${interaction.user.username}** bought ${member.user} <a:Cheers:738820410681851915>`)

                return interaction.editReply({embeds:[embed]});
}

// Choke sub-command

else if(subcommand === "choke"){
                // Choke sub-command
                if (member.id === interaction.user.id) { return interaction.editReply("Kinky much?") }
                if(chibi) return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/3jJZgyT.gif")
                        .setAuthor({name: `${interaction.user.username} Just tried to choke ${member.user.username} 😵🥴`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]})

                let random = ["https://i.imgur.com/p6b4eBe.gif","https://i.imgur.com/ISnhSVc.gif","https://i.imgur.com/drBE7Me.gif","https://i.imgur.com/1tVHc2Y.gif","https://i.imgur.com/XHbLIQZ.gif","https://i.imgur.com/ppK575E.gif","https://i.imgur.com/inzaJLh.gif","https://i.imgur.com/tJvTNER.gif","https://i.imgur.com/VK58Ic5.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} Just tried to choke ${member.user.username} 😵🥴`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `If they were craving blood or just horny, nobody knows....`})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
// Cum sub-command

else if(subcommand === "cum"){
                if (member.id === interaction.user.id) { return interaction.editReply("What you just tried to achieve was beyond a mere homosexual's reach") }

                let random = ["https://i.imgur.com/MD0Ml5o.gif","https://i.imgur.com/OujBS62.gif","https://i.imgur.com/WtTPp9U.gif"
                    ,"https://i.imgur.com/A5pgXDS.gif","https://i.imgur.com/YwE6s7Z.gif","https://i.imgur.com/t6rE8CA.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/np0XZX7.gif")
                        .setDescription(`*${interaction.user} just came all over ${member.user} 😫😳🍼*`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} jizzzzzzzzzed!`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `Spitters are quitters but who'll clean the mess doe?`})
                    .setDescription(`*${interaction.user} just came all over ${member.user} 😫😳🍼*`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }

// Fist sub-command

else if(subcommand === "fist"){
                if (member.id === interaction.user.id) { return interaction.editReply({content : "Okay, no."}) }

                let random = ["https://i.imgur.com/EbpitKy.gif","https://i.imgur.com/AGFTtzv.gif","https://i.imgur.com/c69GzVj.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/BlxNQE8.gif")
                        .setDescription(`**${interaction.user} fisted you ${member.user}** <:Balloon:738767809840152656><:Balloon:738767809840152656><:Balloon:738767809840152656>`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`**${interaction.user} fisted you ${member.user}** <:Balloon:738767809840152656><:Balloon:738767809840152656><:Balloon:738767809840152656>`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }

// Fondle
else if(subcommand === "fondle"){

                if (member.id === interaction.user.id) { return interaction.editReply({content : "Stop touching yourself, everyone's looking 😳"}); }

                const random = ["https://i.imgur.com/XBEJvtc.gif", "https://i.imgur.com/xWm2f7V.gif", "https://i.imgur.com/eTUqQKb.gif", "https://i.imgur.com/TwDdyH6.gif", "https://i.imgur.com/2HD7jP6.gif", "https://i.imgur.com/qKRYblo.gif", "https://i.imgur.com/abdqBT9.gif", "https://i.imgur.com/F0DaGBc.gif", "https://i.imgur.com/YDkRfzW.gif"];
                const gif = random[Math.floor(Math.random() * random.length)];

                if(chibi===true) { return interaction.editReply({ embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/KdQSj8v.gif")
                        .setDescription(`${interaction.user} is fondling ${member.user} 🤤🏀`)] }); }

                const embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({ name: `${interaction.user.username} is in a mood...`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setFooter({ text: "B-baka!!" })
                    .setDescription(`${interaction.user} is fondling ${member.user}} 🤤🏀`)
                    .setImage(gif);

                return interaction.editReply({ embeds: [embed] });

            }
// Peg

else if(subcommand === "peg"){

                let random = ["https://i.imgur.com/yVc1QF6.gif","https://i.imgur.com/2jr11oo.gif","https://i.imgur.com/w9Nd2hs.gif","https://i.imgur.com/AB8IAUe.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { return interaction.editReply("*um..No.*") }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/65I1f8A.gif")
                        .setAuthor({name: `${interaction.user.username} tried pegging ${member.user.username} 😨`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setFooter({text: "Oh God Oh F*ck..."})
                    .setAuthor({name: `${interaction.user.username} tried pegging ${member.user.username} 😨`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }

// Smash

else if(subcommand === "smash"){

                if (member.id === interaction.user.id) { return interaction.editReply("That's just a yikes.") }

                let random = ["https://i.imgur.com/eHYoocw.gif","https://i.imgur.com/oqbcwOU.gif","https://i.imgur.com/lETBSkT.gif","https://i.imgur.com/IKp9n4d.gif","https://i.imgur.com/JhcaUzS.gif","https://i.imgur.com/Nu1HBkR.gif","https://i.imgur.com/gnM1B0L.gif","https://i.imgur.com/pR5iXgW.gif","https://i.imgur.com/t54joM2.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/XQJYHKr.gif")
                        .setAuthor({name: `${interaction.user.username} just smashed ${member.user.username} 😰🥶😱`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} just smashed ${member.user.username} 😰🥶😱`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setFooter({text: `😭 oh boy... 😭`})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }
// Spank
else if(subcommand === "spank"){

                let random = ["https://i.imgur.com/6p0Tmtk.gif","https://i.imgur.com/SQR04l0.gif","https://i.imgur.com/6LBQnim.gif","https://i.imgur.com/brcIQhL.gif","https://i.imgur.com/r1nL4aN.gif","https://i.imgur.com/2DPkLOY.gif","https://i.imgur.com/3TjF9W4.gif","https://i.imgur.com/rDDnKxN.gif","https://i.imgur.com/Htr2rdk.gif"]

                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { const emb = new MessageEmbed().setImage("https://media.tenor.com/images/86169e5a54e4c562d62184f5f135b13a/tenor.gif")
                    return interaction.editReply({embeds: [emb]}) }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/6VWZnlA.gif")
                        .setDescription(`${member.user} got SPANKED by ${interaction.user.username} <:Balloon:738767809840152656><:Balloon:738767809840152656>`)]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`${member.user} got SPANKED by ${interaction.user.username} <:Balloon:738767809840152656><:Balloon:738767809840152656>`)
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }

// Tickle
else if(subcommand === "tickle"){

                let random = ["https://i.imgur.com/tmDdFvg.gif","https://i.imgur.com/VGffMD5.gif","https://i.imgur.com/XIu2wV8.gif","https://i.imgur.com/c9nFZMk.gif","https://i.imgur.com/6OWBiOY.gif","https://i.imgur.com/nllp5XR.gif","https://i.imgur.com/blGvYKz.gif","https://i.imgur.com/VD8nvU5.gif","https://i.imgur.com/PYcs0sx.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                if (member.id === interaction.user.id) { return interaction.editReply("*um..No.*") }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/TBYyYoe.gif")
                        .setAuthor({name: `${interaction.user.username} is tickling ${member.user.username} 😂`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})]}) }

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor({name: `${interaction.user.username} is tickling ${member.user.username} 😂`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }

// Touch

else if(subcommand === "touch"){

                if (member.id === interaction.user.id) { return interaction.editReply("Time to play with yourself, eh? 💦") }

                if(chibi===true) { return interaction.editReply({embeds: [new MessageEmbed().setColor("RANDOM")
                        .setThumbnail("https://i.imgur.com/Y9VcdVr.gif")
                        .setDescription(`${interaction.user} touched ${member.user} 😳`)]}) }

                let random = ["https://i.imgur.com/u9RlkSr.gif","https://i.imgur.com/iFKyr9C.gif","https://i.imgur.com/F9pN5VA.gif","https://i.imgur.com/KYaLctK.gif","https://i.imgur.com/EuOh7LC.gif","https://i.imgur.com/guBOcZx.gif","https://i.imgur.com/oFpwzDc.gif","https://i.imgur.com/tQcg5nh.gif"]
                let gif = random[Math.floor(Math.random() * random.length)]

                let embed = new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription(`${interaction.user} touched ${member.user} 😳`)
                    .setFooter({text: `What're they planning to do.... 👀`})
                    .setImage(gif);

                return interaction.editReply({embeds: [embed]});
            }



 */


