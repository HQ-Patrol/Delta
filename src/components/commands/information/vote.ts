import Topgg from '@top-gg/sdk';
import { Economy } from '../../../database/models/EconomyModel';
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import Discord, { MessageEmbed } from "discord.js";
import { IUser, User } from "../../../database/models/UserModel";
import { CooldownsModel } from "../../../database/models/CooldownsModel";
import pretty from "pretty-ms";
import { items } from '../../../data/json/items.json'
import userWeeklyMissionsModel from "../../../database/models/UserWeeklyMissionsModel";
import userMonthlyMissionsModel from "../../../database/models/UserMonthlyMissionsModel";

const topgg = new Topgg.Api('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2MzUwNjI4MDQyMTM5MjQ2NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjE0Nzg4MDEwfQ.gL96XVC3O0QRIMgfr4WikBHYIAuojjHHHhBwuw1MwhQ')

@ApplyOptions<Command.Options>({
    name: "vote",
    description: "Vote Vote Vote for Patrol Bot! Vote every 12 hours to get an amazing rewards"
})

export class VoteCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        await interaction.deferReply();

        // Vote Command
        const hasVoted = await topgg.hasVoted(interaction.user.id);
        if(!hasVoted){
            return interaction.editReply({ embeds: [new MessageEmbed()
                    .setThumbnail("https://i.imgur.com/ab2g21s.gif")
                    .setTitle("You haven't Voted! ❌")
                    .setColor("RANDOM")
                    .setDescription("<a:GoVote:787376884731478046> [**Click here to Vote for Patrol Bot and show your SUPPORT!**](https://top.gg/bot/763506280421392466/vote) <:LETSFUCKINGGOOOOOOOOO:763281511003717683>"+
                        "\n<:MysteryBox1:855561382896468021> **For every Vote, you can CLAIM Mystery Boxes/Eggs and 1000** <a:Coins:775714101564276756> ")
                    .setFooter({ text: "You can VOTE every 12 hours ⏰" })] })
        }

        else{
            const user = await User.findOne<IUser>({ id: interaction.user.id });
            if(!user){ return interaction.editReply({ content: "Please use </balance:1021015706847952956>" }) }

            let q =1;
            const prizeName = "mystery box 1"; // Until solution to petUtil is figured out.
            if(user.premium === true){ q=2}
            //const egg = petUtils.rndNumber(1, 5);
            //if(egg == 3) { prizeName = "soft boiled egg"; }
            // else { prizeName = "mystery box 1"; }

            let weekly = await CooldownsModel.findOne({ id: interaction.user.id })
            if(!weekly){
                weekly =  await CooldownsModel.create({
                    id: interaction.user.id,
                    daily: {
                        days: 0,
                        last: Date.now()
                    },
                    days: 0,
                    next: Date.now(),
                    resets: Date.now(),
                    weeklyReset: Date.now(),
                    voteReset: Date.now()
                })

                await weekly.save();
            }
            if(Number(weekly.vote.last) > Date.now()) {
                return interaction.editReply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle("Voting Reward Cooldown 🎁")
                            .setColor("RED")
                            .setDescription(`<a:RedTick:736282199258824774> **|** Please wait for **${pretty(Number(weekly.voteReset) - Date.now())}** before claiming Voting Rewards <a:PatrolBot:736282237225533571>`)]
                })
            }
            let data = await Economy.findOne({ id: interaction.user.id });
            if(!data){
                data = await Economy.create({
                    id: interaction.user.id,
                    coins: 0,
                    bank: 0,
                    xp: 0,
                    level: 1,
                    items: [],
                    bracket: 1
                })
            }

            weekly.last =  Date.now() + 41_400_000 ;
            await weekly.save();

            const item = items.find(item => item.name.toLowerCase() === prizeName)!;
            const myItems = data.items;

            if(myItems.length > 0) {
                const checkMe = data.items.findIndex(item => item.name.toLowerCase() === prizeName);
                if(checkMe >= 0) {
                    const newData = data.items;
                    newData[checkMe].count += q;

                    await Economy.findOneAndUpdate({
                            id: interaction.user.id
                        },
                        {
                            items: newData,
                            lastUse: Date.now(),
                            $inc: { coins: 1000 }
                        });

                }
                else {
                    const newData = data.items;
                    newData[newData.length-1].name = item.name;
                    newData[newData.length-1].count = q;
                    newData[newData.length-1].icon = item.icon;
                    newData[newData.length-1].type = item.type;
                    newData[newData.length-1].data = item.data;

                    await Economy.findOneAndUpdate({
                            id: interaction.user.id
                        },
                        {
                            items: newData,
                            lastUse: Date.now(),
                            $inc: { coins: 1000 }
                        });
                }
            }
            else {
                await Economy.findOneAndUpdate({
                        id: interaction.user.id
                    },
                    {
                        items: [{ name: item.name, count: q, type: item.type, data: item.data, icon: item.icon }],
                        lastUse: Date.now(),
                        $inc: { coins: 1000 }
                    });
            }

            await interaction.editReply({ embeds: [new MessageEmbed()
                    .setThumbnail("https://i.imgur.com/ab2g21s.gif")
                    .setTitle("Thanks for Voting! ✅🌟")
                    .setColor("RANDOM")
                    .setDescription(`You voted for Patrol bot! Here's your reward:\n➥ \`x${q}\` **\`${item.name}\`** ${item.icon} + \`1000\` <a:Coins:775714101564276756>`)
                    .addFields([
                        {
                            name: "<a:CleanWoman:728219543658561606> Invite this Bot",
                            value: "[Click Here](https://discord.com/api/oauth2/authorize?client_id=763506280421392466&permissions=8&scope=bot)",
                            inline: true
                        },
                        {
                            name: "<:DiscordLogo:730154954492477482> Support Server",
                            value: "[Click here to Join](https://discord.gg/HQ)",
                            inline: true
                        },
                        {
                            name: "<a:PatrolBot:736282237225533571> Website",
                            value: "[Click here to Visit](https://patrolbot.xyz)",
                            inline: true
                        }
                    ])
                    .setFooter({ text: "➤ You can VOTE and CLAIM your reward every 12 hours ⏰" })] })

            // Weekly Section

            const weeklyData = await userWeeklyMissionsModel.findOne({ id: interaction.user.id });
            if(!weeklyData) {
                await userWeeklyMissionsModel.create({
                    id: interaction.user.id,
                    vote: {
                        value: 1,
                        prize: false,
                        prizePlus: false
                    }
                });
            }
            else {
                if(weeklyData.vote.value>0) { weeklyData.vote.value+=1; } else { weeklyData.vote.value=1; }
                await weeklyData.save().catch((err: Error) => console.log(err));
            }

            const monthlyData = await userMonthlyMissionsModel.findOne({ id: interaction.user.id });

            if(!monthlyData) {
                await userMonthlyMissionsModel.create({
                    id: interaction.user.id,
                    vote: {
                        value: 1,
                        prize: false,
                        prizePlus: false
                    }
                });
            }
            else {
                if(monthlyData.vote.value>0) { monthlyData.vote.value+=1; } else { monthlyData.vote.value=1; }

                await monthlyData.save().catch(err => console.log(err));
            }

            return;
        }
    }
}