/*
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { User } from "../../../database/models/UserModel";
import { AFKModel, IAfk } from "../../../database/models/AFKModel";

@ApplyOptions<Command.Options>({
    name: "afk",
    description: "Set your AFK[Away from Keyboard] status whenever you are AFK"
})

export class AFKCommand extends Command{
    public registerApplicationCommands(registry: ApplicationCommandRegistry){
        registry.registerChatInputCommand((builder) =>
        builder
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for AFK")
            )
        )
    }
    public chatInputRun(interaction: ChatInputCommand.Interaction){
        const reason = interaction.options.getString("reason") ?? "AFK"
        const user = User.findOne({ _id: interaction.user.id })

        const afkData = AFKModel.findOne({ _id: interaction.guild!.id }) ;
        if (afkData.afkMembers.findIndex((x) => x.id === interaction.user.id) < 0) {
            const reason = args.join(" ") || "AFK";
            const afkMsg = `afk was set: ${reason}`
            if(afkMsg.includes("discord.gg") || afkMsg.includes("www.") || afkMsg.includes(".com") || afkMsg.includes("https://"))
            { if(!user.premium || user.premium===false)
            { message.delete(); return message.channel.send("__**Only Premium Users**__ can add **LINKS** in their AFKs. `Learn more: https://patrolbot.xyz/store` 💰").then(del => setTimeout(() => del.delete(), 5000));}
            }
            afkData.afkMembers.push({ id: message.author.id, reason });
            await afkData.save();
            message.reply({ content: afkMsg, allowedMentions: { parse: [] } }).catch(err => console.log(`AFK message couldn't be replied to!`));
            message.member
                .setNickname(`[AFK] ${message.member.displayName}`)
                .catch(() => {});
        }
    }
}*/
