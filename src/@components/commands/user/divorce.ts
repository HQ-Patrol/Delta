import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Message, MessageEmbed, Util } from "discord.js";
import { IMarriage, MarriageModel } from '../../../database/models/MarriageModel';
import { promptMessageReaction } from '../../../utilities/prompt/promptMessageReaction';
import pretty from "pretty-ms";

@ApplyOptions<Command.Options>({
    name: "divorce",
    description: "End your marriage with your other half 💔"
})

export class DivorceCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
        )
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){

        await interaction.deferReply();

        let user1 = await MarriageModel<IMarriage>.findOne({ id: interaction.user.id })
        if(!user1) {
            user1 = await MarriageModel.create({ id: interaction.user.id, spouse: "", total: 0, spouses: [] })
            return interaction.editReply({ content: "You're married to nobody. Maybe try to get a spouse? 👰" })
        }
        if(user1.spouse == ""){
            return interaction.editReply({ content: "Wtf you on? You're a lonely bozo married to nobody <a:OhShitLookAtTheTimeWatch:751527814691553280>" })
        }
        const user2 = await MarriageModel.findOne<IMarriage>({ id: user1.spouse })
        if (!user2) return interaction.editReply("There seems to be an error here. You might wanna report this in Bot's Support server!\n➡ https://discord.gg/hq")

        const promptEmbed = new MessageEmbed()
            .setColor("RED")
            .setThumbnail("https://i.imgur.com/WjtG9HE.gif")
            .setDescription(`**Are you sure you want to __Divorce__ your spouse: <@${user1.spouse}>?**\n\n\`In doing so you'll also be losing 50% of your Bank if you never signed a prenup\`⚠`)
            .setFooter({ text: "You have 60 seconds to react with ✅ or ❌ to confirm or deny the Divorce" })

        const msg = await interaction.editReply({ embeds: [promptEmbed] }) as Message;
        const response = await promptMessageReaction(msg, ["✅", "❌"], (interaction.member as GuildMember), 60)

        if(response?.emoji.id === (Util.parseEmoji("✅"))!.id){
            // Proceed with the divorce.
            await interaction.editReply({ embeds: [new MessageEmbed()
                    .setColor("DARK_BUT_NOT_BLACK")
                    .setThumbnail("https://i.imgur.com/uvGbLJG.gif")
                    .setTitle("DIVORCED 📜")
                    .setDescription(`➜ ${interaction.user} just ended their **${ pretty(Date.now()- (Number(user1.time) )) }** long marriage with <@${user1.spouse}> .ʜᴇʀᴇ'ꜱ ᴡɪꜱʜɪɴɢ ʙᴏᴛʜ ᴏꜰ ᴛʜᴇᴍ ɢᴏᴏᴅ ʟᴜᴄᴋ ꜰᴏʀ ᴛʜᴇɪʀ ʀᴇꜱᴘᴇᴄᴛɪᴠᴇ ʟɪᴠᴇꜱ\` 👍`)] });

            // Make changes to the DB
            await MarriageModel.updateOne({ id: interaction.user.id }, { spouse: "", time: "" });
            await MarriageModel.updateOne({ id: user2.id }, { spouse: "", time: "" })

        }
        else if(response?.emoji.id === (Util.parseEmoji("❌"))){
            // Cancel the divorce.
            return interaction.editReply({ embeds: [new MessageEmbed()
                    .setColor('#FFB6C1')
                    .setDescription(`➜ The counselling worked! You decided to give <@${user1.spouse}> another chance & cancelled the divorce process 💕`)] })
        }

    }
}