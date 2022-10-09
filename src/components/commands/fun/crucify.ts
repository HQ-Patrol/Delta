import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { IRole, RoleModel } from "../../../database/models/RoleModel";
import { GuildMember, Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { GuildModel, IGuild } from "../../../database/models/GuildModel";

@ApplyOptions<Command.Options>({
    name: "crucify",
    description: "Get ANY server member banned if you have the required amount of people supporting you ⚔"
})

export class CrucifyCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The User to overthrow.")
                .setRequired(true)
            )
            .addNumberOption((option) =>
            option
                .setName("participants")
                .setDescription("Required amount of people needed for the crucification")
                .setRequired(true)
                .setMinValue(1)
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction) {
       const msg =  await interaction.deferReply({ fetchReply: true }) as Message;
       const member = interaction.member! as GuildMember

       const Allow = await RoleModel.findOne<IRole>({ id: msg.guild!.id })

        if(Allow) {
            if(!(Allow.crucify.length<1)){
                if(!member.roles.cache.has(Allow.crucify[0].role)) { return interaction.editReply({ embeds: [{ color: "RED", description: `You don't seem to have the required Role/Rank <@&${Allow.crucify[0].role}> to use \`Crucify\` command <a:exclamation:741988026296696872>` }] }) }
            }
        }

        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const target = await msg.guild!.members.fetch(interaction.options.getUser("user")!.id)
        const txt = ["Picked up stones", "Dug out his grandpa's WW2 shotgun", "Lit some torches", "Whipped his D!ck out for no reason whatsoever", "In a mood to run over anything", "made black flags", "smeared his face with charcoal in anger", "has no idea what's going on tbh", "picked up some nearby sticks", "cancelled his movie plans", "loading his revolver", "called the cops for help but he forgot his skin color 😭", "moved to cuba to stratergize plan of attack with Tupac and X", "is pretty friggin' angry for some reason?", "has 3 counts of tax fraud against him", "actually disappeared 2 years back but wait how'd he get here??", "Picked up stones", "Dug out his grandpa's WW2 shotgun", "Lit some torches", "Whipped his D!ck out for no reason whatsoever", "In a mood to run over anything", "made black flags", "smeared his face with charcoal in anger", "has no idea what's going on tbh", "picked up some nearby sticks", "cancelled his movie plans", "loading his revolver", "called the cops for help but he forgot his skin color 😭", "moved to cuba to stratergize plan of attack with Tupac and X", "is pretty friggin' angry for some reason?", "has 3 counts of tax fraud against him", "actually disappeared 2 years back but wait how'd he get here??", "Picked up stones", "Dug out his grandpa's WW2 shotgun", "Lit some torches", "Whipped his D!ck out for no reason whatsoever", "In a mood to run over anything", "made black flags", "smeared his face with charcoal in anger", "has no idea what's going on tbh", "picked up some nearby sticks", "cancelled his movie plans", "loading his revolver", "called the cops for help but he forgot his skin color 😭", "moved to cuba to stratergize plan of attack with Tupac and X", "is pretty friggin' angry for some reason?", "has 3 counts of tax fraud against him", "actually disappeared 2 years back but wait how'd he get here??", "Picked up stones", "Dug out his grandpa's WW2 shotgun", "Lit some torches", "Whipped his D!ck out for no reason whatsoever", "In a mood to run over anything", "made black flags", "smeared his face with charcoal in anger", "has no idea what's going on tbh", "picked up some nearby sticks", "cancelled his movie plans", "loading his revolver", "called the cops for help but he forgot his skin color 😭", "moved to cuba to stratergize plan of attack with Tupac and X", "is pretty friggin' angry for some reason?", "has 3 counts of tax fraud against him", "actually disappeared 2 years back but wait how'd he get here??", "Picked up stones", "Dug out his grandpa's WW2 shotgun", "Lit some torches", "Whipped his D!ck out for no reason whatsoever", "In a mood to run over anything", "made black flags", "smeared his face with charcoal in anger", "has no idea what's going on tbh", "picked up some nearby sticks", "cancelled his movie plans", "loading his revolver", "called the cops for help but he forgot his skin color 😭", "moved to cuba to stratergize plan of attack with Tupac and X", "is pretty friggin' angry for some reason?", "has 3 counts of tax fraud against him", "actually disappeared 2 years back but wait how'd he get here??", "Picked up stones", "Dug out his grandpa's WW2 shotgun", "Lit some torches", "Whipped his D!ck out for no reason whatsoever", "In a mood to run over anything", "made black flags", "smeared his face with charcoal in anger", "has no idea what's going on tbh", "picked up some nearby sticks", "cancelled his movie plans", "loading his revolver", "called the cops for help but he forgot his skin color 😭", "moved to cuba to stratergize plan of attack with Tupac and X", "is pretty friggin' angry for some reason?", "has 3 counts of tax fraud against him", "actually disappeared 2 years back but wait how'd he get here??"]
        const Probab = Math.random() < 0.5 ? "l" : "w";

        if(!target){
            return interaction.editReply({ content: "Couldn't find the member, try again." })
        }
        if (target.id === interaction.user.id) { return interaction.editReply({ content: "Just click on **Leave server**, stop being f*cking extra 💀" })}
        if (!target.bannable) {
            await interaction.editReply({ content: "I can't possible ban a God while being a peasant myself😫 Move me up in roles, maybe😏" });
            return msg.delete();
        }

        const guild = await GuildModel.findOne<IGuild>({ _id: interaction.guild!.id });
        if(!guild) {
            return msg.edit("You should probably try Kicking and Re-inviting the bot to solve this error ❗")
        }

        let maxUsers = 10;
        if(guild.crucify) maxUsers = guild.crucify;

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setImage("https://i.imgur.com/Ixr7xf5.gif")
            .setTitle(`⚒ A spark of rebellion was seen 🔥`)
            .setDescription(`**Do you want to participate in the public executioning of ${target}?**\n\n⚠\`BEWARE! Incase you end up failing there might be serious repercussions!\`⚠`)
            .setFooter({ text: `➤ Atleast ${maxUsers} required!` })
            .setTimestamp(msg.createdTimestamp)

        const message = await msg.channel.send({ embeds: [embed] });
        await message.react('⚰')
        const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === '⚰' && !(user.id === interaction.client.user!.id) && !(user.id === interaction.user.id)
        const collector = msg.createReactionCollector({ filter,  time: 100000, maxUsers });

        collector.on('collect', r => {
            const theuserid = r.users.cache.lastKey()
            if (theuserid === interaction.user.id || theuserid === interaction.client.user!.id) return;
            return message.channel.send(`<@${theuserid}> just joined the rebellion! ⚔`)
        });

        collector.on('end', async collected => {
            if (![...collected.values()][0]) {
                await member.timeout(600000)
                return message.channel.send(`Nobody joined ${message.author}'s rebellion and he ended up getting TIMED-OUT for 10 minutes!`)
            }

            const ids = ([...[...collected.values()][0].users.cache.keys()]).filter(id => id !== interaction.client.user!.id && id !== interaction.user.id && id !== target.user.id)
            ids.unshift(message.author.id)
            if (ids.length < maxUsers) return message.channel.send("Not enough people joined rebellion <:WAH:740257222344310805> 😒")
            const randnum =Math.floor(Math.random()*ids.length)

            let startmessage = "";
            for (let i=0; i< ids.length; i++) {
                if (i == ids.length-1) startmessage += `and <@${ids[i]}> decided to start a rebellion against ${target.user}!`
                else startmessage += `<@${ids[i]}>, `
            }

            const emb1 = new MessageEmbed()
                .setImage("https://i.imgur.com/aET5wxR.gif")
                .setColor("DARK_BUT_NOT_BLACK")
                .setTitle("REBELLION JUST ERUPTED!")
                .setFooter({ text: "Will they succeed?" })
                .setDescription(startmessage)

            await message.channel.send({ embeds: [emb1] })
            for (let i=0; i < ids.length; i++) {
                await sleep(1000)
                await message.channel.send(`<@${ids[i]}>` + ` ${txt[i]}`)
            }
            await sleep(2500)

            if (Probab=="w")
            {

                await message.guild!.members.cache.get(target.id)!.ban().catch(err => {
                    if (err) return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`)
                });
                const emb1 = new MessageEmbed().setColor("#00FF00").setTitle("✝ Crucification Commenced! ✝").setDescription(`<:EricaEvilPlotting:897841584647847986> ${target.user} __**IS OVERTHROWN AND BANNED FROM ${message.guild!.name.toUpperCase()} SERVER!**__ <:RestInPiss:745740745058811904>`).setImage("https://i.imgur.com/l6tdp7y.gif");
                await message.channel.send({ embeds: [emb1] })
                console.log("W");
            }
            //if ends
            else {
                const banned = ids[randnum];
                const emb2 = new MessageEmbed().setColor("RED").setTitle("❌ Rebels were STOMPED! ❌").setDescription(`${target.user} had a whole friggin' SWAT team ready on his disposal and ended up running over the whole mob with goddamn Tank <a:Tank1:748520917860220928><a:Tank2:748520918124593234>\n\n<a:F1:748181117856645131><a:F2:748181117592666122> <@${banned}> **& ${message.author} were the sad casualties in this bad attempt to overthrow ${target.user}. They won't be missed ⚰** <:RestInPiss:745740745058811904>`).setImage("https://i.imgur.com/GTKglg0.gif");
                console.log("L");

                message.channel.send({ embeds: [emb2] })
                await member.kick("FAILED REBELS").catch(err => {
                    if (err) return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`)
                });
                await message.guild!.members.cache.get(banned)!.kick('FAILED REBELS').catch(err => {
                    if (err) return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`)
                });
            }
        });
    }
}