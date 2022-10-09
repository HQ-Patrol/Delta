/*
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { IRole, RoleModel } from '../../../database/models/RoleModel';
import { GuildMember, Message, MessageEmbed, Permissions } from "discord.js";
import {
    createAudioPlayer,
    AudioPlayerStatus,
    createAudioResource,
    entersState,
    VoiceConnectionStatus,
    joinVoiceChannel,
    DiscordGatewayAdapterCreator
} from '@discordjs/voice';

@ApplyOptions<Command.Options>({
    name: "fart",
    description: "Fart in the VC you or your friend is in and maybe you'll be able to deafen them. Just like everything else, there's a risk involved!"
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
        const msg = await interaction.deferReply({ fetchReply: true }) as Message;
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

            if (!member.voice.channel?.joinable) return message.reply('The Voice Channel is not joinable for me. Check Permissions!');
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
                msg.channel.send({embeds: [embed]});

                const audioPlayer = createAudioPlayer();

                let voiceConnection = joinVoiceChannel({
                    channelId: member.voice.channelId!,
                    guildId: msg.guildId!,
                    adapterCreator: (msg.guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator),
                });

                voiceConnection = await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);

                await msg.react("✅");

                if(voiceConnection.status === VoiceConnectionStatus.Ready ){

                    voiceConnection.subscribe(audioPlayer);
                    audioPlayer.play(createAudioResource('fart.mp3'));
                }

                audioPlayer.once(AudioPlayerStatus.Idle, () => { voiceConnection.destroy(); audioPlayer.stop(); });
                return;
            }
        }
        
    }
}*/
