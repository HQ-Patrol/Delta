import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { RoleModel } from "../../../database/models/RoleModel";
import Discord, { GuildMember, TextChannel } from "discord.js";
import humanizeDuration from "humanize-duration";
import ms from "ms";
import UserWeeklyMissionsModel from "../../../database/models/UserWeeklyMissionsModel";
import UserMonthlyMissionsModel from "../../../database/models/UserMonthlyMissionsModel";

const simped = new Map();

@ApplyOptions<Command.Options>({
    name: "snap",
    description: "Pick up your Infinity gauntlet and snap! If you win, you'll purge a random number of messages"
})


export class SnapCommand extends Command{
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

        if(interaction.channel!.id == "763080905714696213" || interaction.channel!.id == "946492481724379148" || interaction.channel!.id == "946492527865909268" || interaction.channel!.id == "780159509728854046" || interaction.channel!.id == "762930247061995528" || interaction.channel!.id == "890696566556459028" || interaction.channel!.id == "1004103866935148544") return interaction.reply({ content: "🙀", ephemeral: true })
        await interaction.deferReply();
        const member = interaction.member! as GuildMember
        const Allow = await RoleModel.findOne({ id: interaction.user.id });
        if(Allow) {
            if(!(Allow.snap.length<1)){
                if(!member.roles.cache.has(Allow.snap[0].role)) { return interaction.editReply({ embeds: [{ color: "RED", description: `You don't seem to have the required Role/Rank <@&${Allow.snap[0].role}> to use \`Snap\` command <a:exclamation:741988026296696872>` }] }) } }
        }

        const cooldown = simped.get(member.id);
        if (cooldown) {
            const remaining = humanizeDuration(cooldown - Date.now(), { units: ['h', 'm', 's'], round: true });
            return interaction.editReply({ content: `${member.user}, Wait \`${remaining}\`! Your infinity gauntlet is still on a cooldown Thanos <a:RedTick:736282199258824774>` })
                .catch(console.error);
        }
        else{
            let res = 0;
            const Probab = Math.random() < 0.5 ? "l" : "w";
            const time = Math.floor(Math.random() * 100000) + 25000;

            const num = Math.floor(Math.random() * 100)
            if(num===0)res=25;
            else if(num<20)res=3
            else if(num<40)res=4
            else if(num<60)res=4
            else if(num===69)res=25
            else if(num<80)res=5
            else if(num<90)res=6
            else if(num<=99)res=7
            else if(num===100)res=50;

            const embed = new Discord.MessageEmbed()
                .setTitle(`${member.user.username} picked up their Gauntlet! 🤚💥`)

            if (Probab=="l")
            {
                embed.setThumbnail("https://i.imgur.com/h3YQidL.gif")
                embed.setColor("#FF0000")
                embed.setDescription(`${member.user} **FAILED** *the snap and ended up getting themselves TIMED-OUT for ${ms(time)}*`)
                await interaction.editReply({ embeds: [embed] });
                member.timeout(time).catch(() => interaction.editReply({ embeds: [{ color: "RED", description: `Error: Patrol Bot doesn't seem to have Permission to Mute this person!` }] }))

                //Weekly/Monthly Mission Section================
                const weeklyDataL = await UserWeeklyMissionsModel.findOne({ id: member.id });
                if(!weeklyDataL) {
                    await UserWeeklyMissionsModel.create({
                        id: member.id,
                        snap: { value: 1, wins: 0, loss: 1, prize: false, prizePlus: false }
                    })
                }
                else {
                    if(weeklyDataL.snap.value>0) { weeklyDataL.snap.value+=1; } else { weeklyDataL.snap.value=1; }
                    if(weeklyDataL.snap.loss>0) { weeklyDataL.snap.loss+=1; } else { weeklyDataL.snap.loss=1;}
                    await weeklyDataL.save().catch(err => console.log(err)); }

                const monthlyDataL = await UserMonthlyMissionsModel.findOne({ id: member.id });
                if(!monthlyDataL) {
                    await UserMonthlyMissionsModel.create({
                        id: member.id,
                        snap: { value: 1, wins: 0, loss: 1, prize: false, prizePlus: false }
                    })
                }
                else {
                    if(monthlyDataL.snap.value>0) { monthlyDataL.snap.value+=1; } else { monthlyDataL.snap.value=1; }
                    if(monthlyDataL.snap.loss>0) { monthlyDataL.snap.loss+=1; } else { monthlyDataL.snap.loss=1;}
                    await monthlyDataL.save().catch(err => console.log(err));
                }
                
                //Weekly/Monthly END=================================================================
            }
            else {
                const target = interaction.options.getMember('user') as GuildMember;
                const channel = interaction.channel as TextChannel;
                if (target) {
                    //console.log("Working...")
                    //console.log(await channel.messages.fetch())
                    const messages = (await channel.messages.fetch()).filter(m => m.author.id === target.id && !m.pinned).first(res)
                    await channel.bulkDelete(messages, true).catch(err => interaction.editReply({ content: `Something went wrong....${err}` }));
                }
                else {
                    await channel.bulkDelete(res).catch(err => interaction.editReply(`Something went wrong....${err}`));
                }

                embed.setThumbnail("https://i.imgur.com/1nde3hG.gif")
                embed.setColor("#00FF00")
                embed.setDescription(`${member} **SUCCESSFULLY** *Snapped ${res} messages from existence!*`)
                try{
                    await interaction.editReply({ embeds: [embed] })
                }
                catch{
                    await channel.send({ embeds: [embed] });
                }

                const monthlyDataW = await UserMonthlyMissionsModel.findOne({ id: member.id });
                if(!monthlyDataW) {
                    await UserMonthlyMissionsModel.create({
                        id: member.id,
                        snap: { value: 1, wins: 1, loss: 0, prize: false, prizePlus: false }
                    })
                }
                else {
                    if(monthlyDataW.snap.value>0) { monthlyDataW.snap.value+=1; } else { monthlyDataW.snap.value=1; }
                    if(monthlyDataW.snap.wins>0) { monthlyDataW.snap.wins+=1; } else { monthlyDataW.snap.wins=1;}
                    monthlyDataW.save().catch(err => console.log(err));
                }
                //Weekly/Monthly END=================================================================
            }
            simped.set(member.id, Date.now() + 600000);
            setTimeout(() => simped.delete(member.id), 600000);
        }

    }
}