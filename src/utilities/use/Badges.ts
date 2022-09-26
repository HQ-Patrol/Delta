import { CommandInteraction, MessageEmbed } from "discord.js";
import { Collection } from "discord.js";
import { UsableItem } from ".";

import { IItem } from "../../types/Item";
import sendError from "../sendError";
import { giveBadge } from "../badges";
import { IEconomy } from "../../database/models/EconomyModel";

const badge = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction, _economy: IEconomy, item: IItem) {
    const response = await giveBadge(interaction.user.id, item.name);
    if (response === null) {
      // this shouldn't happen
      sendError(
        interaction,
        "An error occured, please join our support server and contact a developer."
      );
      return false;
    }
    const [success, badge] = response;
    if (success === false) {
      // already have
      sendError(
        interaction,
        `You already have the badge: ${badge.badge} **${badge.name}**!`
      );
      return false;
    }

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setThumbnail("https://i.imgur.com/nZd3jZE.gif")
          .setColor("RANDOM")
          .setTitle("➦ New Badge Added to Collection ✅🎖")
          .setDescription(
            `${interaction.user} **was awarded with the badge: __${item.name}__** ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
          ),
      ],
    });
    return true;
  },
};

export function register(collection: Collection<string, UsableItem>) {
  collection.set("heroofsovietunion", badge);
}
