const Discord = require("discord.js");
const ms = require("ms");
const prettyMs = require("pretty-ms");

const EconomyModel = require("../../../database/models/EconomyModel");
const CooldownsModel = require("../../../database/models/CooldownsModel");

const findOneOrCreate = require("../../../database/functions/findOneOrCreate");

const { addItemsToUser } = require("../../../utilities/query/inventory");
const { safe } = require("../../../utilities/messagePromiseSafe");

const { items } = require("../../../data/json/items.json");

const WEEKLY_COOLDOWN = ms("7d");

module.exports = {
  name: "weekly",
  description: "Get your weekly prize for being a premium user of Patrol Bot!",
  usage: "weekly",
  category: "economy",
  cooldown: 10,
  premiumOnly: true,
  run: async (client, message, args) => {
    const Weekly = await findOneOrCreate(
      { id: message.author.id },
      { id: message.author.id },
      CooldownsModel,
    );

    // Check cooldown
    if (Date.now() < Weekly.nextWeekly) {
      // Not allowed
      return message.sendError(`Please wait **${prettyMs(Weekly.nextWeekly - Date.now(), { verbose: true })}** before claiming your next Weekly!`);
    }

    const final = message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("Random")
          .setImage("https://i.imgur.com/ICvQwCS.gif")
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
          .addFields({
            name: "ITEMS",
            value: "`1x` <:MysteryBox2:855561378790506508> **Mystery Box 2**\n`1x` <:MediumBoiledEgg:922055217950887956> **Medium Boiled Egg**",
          })
          .setDescription(
            `${message.author} used their Premium Perks and received their weekly bonus!`,
          ),

      ],
    });

    return final.then(safe(async () => {
      await Promise.all([
        // Set weekly
        CooldownsModel.updateOne({ id: message.author.id }, { nextWeekly: Date.now() + WEEKLY_COOLDOWN }),
        // Add items
        addItemsToUser(message.author.id, {
          "Mystery Box 2": 1,
          "Medium Boiled Egg": 1,
        }),
      ]);
    }));
  },
};
