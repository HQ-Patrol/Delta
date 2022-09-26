import { Collection, CommandInteraction, MessageEmbed } from "discord.js";
import { UsableItem } from ".";
import { IEconomy } from "../../database/models/EconomyModel";

import { IItem } from "../../types/Item";
import { addItemToUser } from "../query/inventory";
import { doMonthlyMission } from "../query/missions";

const banana = {
	supportsQuantity: true,
  waitForSuccess: true,
	async use(interaction: CommandInteraction, _economy: IEconomy, item: IItem, quantity: number) {
		await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`Tag the monke you want to give x${quantity} banana${quantity > 1 ? "s" : ""} to 🙊 `)
          .setDescription(
            "`This window will close in 30 seconds` <a:timer:838498902067380280>"
          ),
      ],
    });

    const response = await interaction.channel
      ?.awaitMessages({
        filter: (msg) => {
          if (msg.author.id !== interaction.user.id) return false;
          const m = msg.mentions.users?.first();
          if (!m || m.id === interaction.user.id || m.bot) return false;
          else return true;
        },
        max: 1,
        time: 30000,
        errors: ["time"],
      })
      .then((res) => res.first())
      .catch(() => {
        interaction.followUp(
          "You didn't even mention anyone! Try again next time."
        );
        return null;
      });

      if (!response || !response.mentions.members) return false;
      const mentioned = response.mentions.members.first();
      if (!mentioned) return false;

      await addItemToUser(mentioned.id, "banana", quantity);

      interaction.followUp(`<a:GreenTick:736282149094949096> | \`x${quantity}\` ${item.icon} ${item.name} delivered to ${mentioned}`);
      return true;
	}
}

const cumchalice = {
  supportsQuantity: false,
  waitForSuccess: true,
  async use(interaction: CommandInteraction) {
    const random = Math.random();
    if(0.1 > random) {
      await doMonthlyMission(interaction.user.id, "use_CumChalice", 1);

      interaction.reply({
        embeds: [
          new MessageEmbed()
            //.setTitle(`💦 This is kind of sticky 🤨`)
            .setColor("RANDOM")
            .setDescription(
              "𝙂𝙤 𝙤𝙣 𝙆𝙞𝙣𝙜, 𝙩𝙖𝙠𝙚 𝙖 𝙨𝙞𝙥 <:CumChalice:855517936025337907>"
            )
            .setImage("https://i.imgur.com/ecAq0HU.jpg"),
        ],
      });
    } else {
      interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(
                "**Collectibles __cannot__ be used** <a:exclamation:741988026296696872>"
              ),
          ],
        })
        .then(() => setTimeout(() => interaction.deleteReply(), 5000));
    }
    return false;
  }
}

export function register(collection: Collection<string, UsableItem>) {
	collection.set("bana", banana); // why is it "bana"
  collection.set("cumchalice", cumchalice);
}