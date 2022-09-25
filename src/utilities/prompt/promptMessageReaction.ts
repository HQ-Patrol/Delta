import {  GuildMember, Message, MessageReaction, Util } from "discord.js";

// Currently configured for marry/divorce commands.

export async function promptMessageReaction(
    message: Message,
    emojis: string[],
    member: GuildMember,
    time: number
): Promise<MessageReaction | undefined>{

    const parsedEmojisId = emojis.map(emoji => (Util.parseEmoji(emoji))?.id);
    const filter = (m: MessageReaction) => {
        if(m.me){
            return false;
        }
        else if(parsedEmojisId.includes(m.emoji.id)){
            return true;
        }
        else if(m.users.cache.has(member.id)){
            return true;
        }
        else{
            return false;
        }
    }
    const response = await message.awaitReactions({ filter: filter, time: time*1000, maxUsers: 1 })
        .catch(() => null)
    return response?.first()
}