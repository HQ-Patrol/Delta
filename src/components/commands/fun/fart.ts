
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { IRole, RoleModel } from '../../../database/models/RoleModel';
import  { GuildMember, Message, MessageEmbed, Permissions } from "discord.js";
import {
    createAudioPlayer,
    AudioPlayerStatus,
    createAudioResource,
    entersState,
    VoiceConnectionStatus,
    joinVoiceChannel,
    DiscordGatewayAdapterCreator
} from '@discordjs/voice';
import UserMonthlyMissionsModel from "../../../database/models/UserMonthlyMissionsModel";
import ms from "ms";
import UserWeeklyMissionsModel from "../../../database/models/UserWeeklyMissionsModel";
import path from "path";

@ApplyOptions<Command.Options>({
    name: "fart",
    description: "Fart in the VC you or your friend is in and maybe you'll be able to deafen them (Risk Involved!)"
})

export class FartCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User")
                .setRequired(false)
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        const msg = await interaction.reply({ content: "💨", fetchReply: true }) as Message;
        const member = interaction.member as GuildMember;
        
        const Allow = await RoleModel.findOne<IRole>({ id: interaction.guild!.id });
        if(Allow) {
            if(!(Allow.fart.length<1)){
                if(!member.roles.cache.has(Allow.fart[0].role)) { 
                    return interaction.editReply({ embeds: [{ color: "RED", description: `You don't seem to have the required Role/Rank <@&${Allow.fart[0].role}> to use \`Fart\` command <a:exclamation:741988026296696872>` }] }) 
                } 
            }
        }

        function sleep (ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        const mentionedMember = interaction.options.getMember("user") as GuildMember;
        if (!mentionedMember) {

            const voiceChannel = member.voice.channelId;
            if (!voiceChannel) { return msg.edit("Connect to a voice channel !").then((m) => m.react('💨')) }

            if (!member.voice.channel?.joinable) return msg.edit('The Voice Channel is not joinable for me. Check Permissions!');
            const permissions = member.voice.channel.permissionsFor((msg.guild!.members.cache.get(interaction.client.user!.id) as GuildMember));
            if (!permissions.has(Permissions.FLAGS.CONNECT)) return msg.edit('I Dont have this permission - [𝘾𝙊𝙉𝙉𝙀𝘾𝙏]');
            if (!permissions.has(Permissions.FLAGS.SPEAK)) return msg.edit('I Dont have this permission - [𝙎𝙋𝙀𝘼𝙆]');
            if (msg.guild!.me!.voice.channelId) return msg.channel.send("I am already Farting!");

            const Probab = Math.random() < 0.5 ? "l" : "w";

            const embed = new MessageEmbed()
                .setTitle(`You tried Farting in Voice Chat 💨`)

            if (Probab=="l")
            {
                embed.setThumbnail("https://i.imgur.com/Y2X8kPJ.gif")
                embed.setColor("#FF0000")
                embed.setDescription(`${interaction.user} *__**FAILED**__ in farting in the Voice Chat and ended up getting themselves TIMED-OUT for 30s*`)
                msg.channel.send({ embeds: [embed] });
                member.timeout(30000).catch(err => msg.channel.send({ embeds: [{ color: "RED", description: `Error: ${err}` }] }))
                return;
            }
            else
            {
                embed.setThumbnail("https://i.imgur.com/60BG3ln.gif")
                embed.setColor("#00FF00")
                embed.setDescription(`${interaction.user} *was __**SUCCESSFUL**__ in farting in the Voice Chat 😷*`)
                msg.channel.send({ embeds: [embed] });

                const audioPlayer = createAudioPlayer();

                let voiceConnection = joinVoiceChannel({
                    channelId: member.voice.channelId!,
                    guildId: msg.guildId!,
                    adapterCreator: (msg.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator),
                });

                voiceConnection = await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000); // TODO: Remove Redundant code.

                await msg.react("✅");

                voiceConnection.once(VoiceConnectionStatus.Ready, async() => {
                    await voiceConnection.subscribe(audioPlayer);
                    audioPlayer.play(createAudioResource(`${path.join(process.cwd(), "fart.mp3")}`));
                } )
                audioPlayer.once(AudioPlayerStatus.Idle, () => { voiceConnection.destroy(); audioPlayer.stop(); });
                return ;

            }
        }
        if(mentionedMember.id === interaction.user.id) return msg.edit("Weirdo Spotted <a:LmaoBlast:741346535358595072>");

        const voiceChannel = mentionedMember.voice.channelId;
        if (!voiceChannel) return msg.channel.send({ embeds: [new MessageEmbed().setDescription(`<a:RedTick:736282199258824774> ${interaction.user} farted on ${mentionedMember.user} but it had NO effect 💪`).setColor("#FF0000")] }).then(() => msg.react('💨'));

        if (!mentionedMember.voice.channel!.joinable) return msg.edit('The Voice Channel is not joinable for me. Check Permissions!');
        const permissions = mentionedMember.voice.channel!.permissionsFor(interaction.client.user!)! ; // Is not Null
        if (!permissions.has(Permissions.FLAGS.CONNECT)) return msg.edit('I Dont have this permission - [𝘾𝙊𝙉𝙉𝙀𝘾𝙏]');
        if (!permissions.has(Permissions.FLAGS.SPEAK)) return msg.edit('I Dont have this permission - [𝙎𝙋𝙀𝘼𝙆]');
        if (interaction.guild!.me!.voice.channelId) return msg.edit("I am already farting!");

        const time = Math.floor(Math.random() * 30000) + 15000;
        const Probab = Math.random() < 0.5 ? "l" : "w";
        const embed = new MessageEmbed()
            .setTitle(`You tried Farting on ${mentionedMember.user.username} 💨`)

        if (Probab=="l")
        {
            embed.setThumbnail("https://i.imgur.com/Y2X8kPJ.gif")
            embed.setColor("#FF0000")
            embed.setDescription(`${member.user} *__**FAILED**__ in farting on ${mentionedMember.user} and ended up getting themselves TIMED-OUT for 1m*`)
            msg.channel.send({ embeds: [embed] });
            await member.timeout(60000).catch(err => msg.channel.send({ embeds: [{ color: "RED", description: `Error: ${err}` }] }))

            //Monthly Mission Section================

            const monthlyDataL = await UserMonthlyMissionsModel.findOne({ id: member.id })
            if(!monthlyDataL) {
                await UserMonthlyMissionsModel.create({
                    id: member.id,
                    fart: { value: 1, wins: 0, loss: 1, prize: false, prizePlus: false }
                })
            }
            else {
                if(monthlyDataL.fart.value>0) { monthlyDataL.fart.value+=1; } else { monthlyDataL.fart.value=1; }
                if(monthlyDataL.fart.loss>0) { monthlyDataL.fart.loss+=1; } else { monthlyDataL.fart.loss=1;}
                await monthlyDataL.save().catch(err => console.log(err));
            }
            
            //Monthly END=================================================================
        }
        else
        {
            embed.setThumbnail("https://i.imgur.com/60BG3ln.gif")
            embed.setColor("#00FF00")
            embed.setDescription(`${member.user} *was __**SUCCESSFUL**__ in farting on ${mentionedMember.user} and deafened them for ${ms(time)}*`)
            msg.channel.send({ embeds: [embed] });

            //Weekly Mission Section================
            const weeklyDataW = await UserWeeklyMissionsModel.findOne({ id: member.user.id });
            if(!weeklyDataW) {
                await UserWeeklyMissionsModel.create({
                    id: member.user.id,
                    fart: { value: 1, wins: 1, loss: 0, prize: false, prizePlus: false }
                })
            }
            else {
                if(weeklyDataW.fart.value>0) { weeklyDataW.fart.value+=1; } else { weeklyDataW.fart.value=1; }
                if(weeklyDataW.fart.wins>0) { weeklyDataW.fart.wins+=1; } else { weeklyDataW.fart.wins=1;}
                await weeklyDataW.save().catch(err => console.log(err)); }
            //Weekly END=================================================================

            const audioPlayer = createAudioPlayer();

            let voiceConnection = joinVoiceChannel({
                channelId: mentionedMember.voice.channelId!,
                guildId: interaction.guildId!,
                adapterCreator: (msg.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator),
            });

            voiceConnection = await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);

            await msg.react("✅");


            voiceConnection.once(VoiceConnectionStatus.Ready, async() => {
                await voiceConnection.subscribe(audioPlayer);
                audioPlayer.play(createAudioResource(`${path.join(process.cwd(), "fart.mp3")}`));
            } )
            audioPlayer.once(AudioPlayerStatus.Idle, () => { voiceConnection.destroy(); audioPlayer.stop(); });

            await sleep(6000)

            await mentionedMember.voice.setDeaf(true, "Farted on");

            setTimeout(function(){
                mentionedMember.voice.setDeaf(false, "Smell Vanished");
                msg.channel.send(`${mentionedMember.user} \`has been undeafened!\``);
            }, time);
        }
    }
}
