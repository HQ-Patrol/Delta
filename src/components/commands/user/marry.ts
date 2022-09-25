import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Message, MessageEmbed, Util } from "discord.js";
import { IMarriage, MarriageModel } from '../../../database/models/MarriageModel';

@ApplyOptions<Command.Options>({
    name: "marry",
    description: "Marry someone and tie yourself in a beautiful, holy and pure e-relationship. Amen🙏"
})

export class MarryCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User")
                .setRequired(true)
            )
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        // Marry Command

        await interaction.deferReply();
        const target = interaction.options.getMember("user") as GuildMember;
        const member = interaction.member as GuildMember;

        if(member.id === target.id) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Stop being a lonely ass. Please. ") ] })
        if(target.user.bot) return interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription("Stop trying to marry a bot. Control your horny!")] })

        let user1 = await MarriageModel.findOne<IMarriage>({ id: member.id }).lean()

        if(!user1) user1 = await MarriageModel.create({ id: member.id, spouse: "", total: 0, spouses: [] })

        let user2 = await MarriageModel.findOne<IMarriage>({ id: target.id }).lean() ;
        if(!user2) user2 = await MarriageModel.create({ id: target.id, spouse: "", total: 0, spouses: [] });

        // Fetch the wife
        let wife1: null | string = null;
        let wife2: null | string = null;

        if(user1.spouse !== "") wife1 = interaction.client.users.cache.get(user1.spouse)?.tag ?? `<@${user1.spouse}>`;
        if(user2.spouse !== "") wife2 = interaction.client.users.cache.get(user2.spouse)?.tag ?? `<@${user2.spouse}>`;

        if(user1.spouse === target.id) return interaction.editReply({ content: "Aww, you're already married to them. Match made in heaven I suppose? 🥺💗" });
        if(wife1) return interaction.editReply({ content: "Halt! You're already married to **${wife1}** 💘💒 (Apparently not happily though <a:CoughCough:776772198660702238>)" });
        if(wife2) return interaction.editReply({ content: "They're already happily married to **${wife2}**! <:bet:715633188457676931> " });

        const promptEmbed = new MessageEmbed()
            .setAuthor({ name: "Marriage Proposal Sent 💍", iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor("RANDOM")
            .setDescription(`**${interaction.user} just proposed ${target} to lawfully marry them under the graceful presence of their well-wishers!**💒`)
            .setFooter({ text: "You have 60 seconds to react with 💞 or 💔 to accept or decline the proposal." })

        const msg = await interaction.editReply({ embeds: [promptEmbed] }) as Message;
        const collector = msg.createReactionCollector({ filter: ((m) => m.users.cache.has(target.id) && !m.me), time: 60*1000 });

        const acceptedEmoji = Util.parseEmoji("💞")!
        const rejectedEmoji = Util.parseEmoji( "💔")!

        await msg.react(`<:${acceptedEmoji.name}:${acceptedEmoji.id}>`);
        await msg.react(`<:${rejectedEmoji.name}:${rejectedEmoji.id}>`);

        collector.on('collect', async(m) => {
            if([rejectedEmoji.id, acceptedEmoji.id].includes(m.emoji.id)){
                // Then cancel/accept the proposal

                if(rejectedEmoji.id === m.emoji.id){
                    msg.channel.send({ embeds: [new MessageEmbed()
                            .setColor('#FF0000')
                            .setDescription(`**Marriage Proposal from ${interaction.user} was __REJECTED__** <a:RedTick:736282199258824774>`)] })
                    return collector.stop("accepted");
                }

                else if(acceptedEmoji.id === m.emoji.id){
                     msg.channel.send({ embeds: [new MessageEmbed()
                            .setColor('RANDOM')
                            .setAuthor({ name: "JUST MARRIED 💏", iconURL: "https://i.imgur.com/TvfFwGx.gif" })
                            .setDescription(`<a:Tada:760515869603790928> Here's wishing the newly-weds ${interaction.user}-${m} a lifetime of love and happiness! <a:heart_gif:731170667671584860>`)] })
                    return collector.stop("Rejected");
                }
            }
        })

        collector.on("end", async() => {
            if(collector.endReason === "accepted"){
                type spousesDataType = {
                    ID: string,
                    Time: string
                }
                const spousesData1: spousesDataType[] = user1!.spouses;
                const spousesData2: spousesDataType[] = user2!.spouses;

                spousesData1.push({
                    ID: target.id,
                    Time: msg.createdAt.toUTCString()
                })
                spousesData2.push({
                    ID: member.id,
                    Time: msg.createdAt.toUTCString()
                })
                await MarriageModel.updateOne({ id: member.id }, { spouse: target.id, time: Date.now(), spouses: spousesData1, total: (user1!.total +1) })
                await MarriageModel.updateOne({ id: target.id }, { spouse: member.id, time: Date.now(), spouses: spousesData2, total: (user2!.total +1) })

            }
        })

        // TODO: To finish the Prenup part later.
    }

}