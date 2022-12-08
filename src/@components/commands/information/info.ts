import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, ChatInputCommand, Command } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

import findByUserId from "../../../database/functions/economy/findUserById";
import findOneOrCreate from "../../../database/functions/findOneOrCreate";
import { BadgesModel } from "../../../database/models/BadgesModel";

import { IBadge } from "../../../types/Badge";
import { IItem } from "../../../types/Item";

import { resolve } from "../../../utilities/badges";
import { emojiToLink, findItem } from "../../../utilities/query/item";
import sendError from "../../../utilities/sendError";

import emoji from "../../../constants/emoji";
@ApplyOptions<Command.Options>({
    name: "info",
    description: "Get information about items, badges and pets."
})

export class InfoCommand extends Command {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Do you want to view an item, badge or pet?")
                        .addChoices(
                            { name: "Item", value: "item" },
                            { name: "Badge", value: "badge" },
                            /*{ name: "Pet", value: "pet" }*/
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription("Please tell us the name of the item, badge or pet!")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        );
    }
    public async chatInputRun(interaction: ChatInputCommand.Interaction){
        const type = interaction.options.getString("type", true);
        const name = interaction.options.getString("name", true);
        
        let embed;

        if(type === "item") {
            const item = findItem(name.toLowerCase()) as IItem;
            if(!item) return sendError(interaction, "That isn't a valid item!");

            const user = await findByUserId(interaction.user.id);

            let description = `You currently own **${user.items.find((i) => i.name === item.name)?.count || 0}** of this item.\n`;
            description += `\n➢ Cost: **${item.price ?? "UNKNOWN"}** ${emoji.coins} | Sell: **${item.sellPrice ?? "UNKNOWN"}** ${emoji.coins}\n`;
            description += `➢ Collateral Price: **${item.collateralPrice}**\n`;
            if(item.usage) description += `➢ Usage: **${item.usage}**\n`;

            description += `\n\` - \` Can be sold? ${item.data.canBeSold ? "**YES**" : "**NO**"}\n`;
            description += `\` - \` Can be traded? ${item.data.canBeTraded ? "**YES**" : "**NO**"}\n`;
            description += `\` - \` Can be used? ${item.data.canBeUsed ? "**YES**" : "**NO**"}\n`;
            description += `\` - \` Can be bought? ${item.data.canBeBought ? "**YES**" : "**NO**"}\n`;
            
            embed = new MessageEmbed()
                .setTitle(item.name)
                .setURL("https://patrolbot.xyz/items")
                .setColor("#ADD8E6")
                .setThumbnail(emojiToLink(item.icon) || "")
                .setFooter({ text: `Type: ${item.type}` })
                .setDescription(`> *${item.description}*\n\n${description}`);
        } else if(type === "badge") {
            const badge = resolve(name);
            if(!badge) return sendError(interaction, "That isn't a valid badge!");

            const userBadges = await findOneOrCreate({ id: interaction.user.id }, { id: interaction.user.id }, BadgesModel);

            const description = 
                userBadges.badges.find((b: IBadge) => b.name === badge.name) ?
                    "**You have obtained this badge!**" :
                    "**You do not have this badge.**"

            embed = new MessageEmbed()
              .setTitle(badge.name)
              .setURL("https://patrolbot.xyz/badges")
              .setColor("#ADD8E6")
              .setThumbnail(emojiToLink(badge.badge) || "")
              .setDescription(`> *${badge.description}*\n\n${description}`);
        } else if(type === "pet") {
            // todo: pets first
        }

        if(!embed) return;
        return interaction.reply({
            embeds: [embed]
        })
    }
}