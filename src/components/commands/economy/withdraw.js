const Discord = require("discord.js");

const findOneOrCreate = require("../../../database/functions/findOneOrCreate");
const EconomyModel = require("../../../database/models/EconomyModel");

const utils = require("../../../utilities/query/economy");

module.exports = {
  name: "withdraw",
  description: "Withdraw money from your bank to use or trade",
  usage: "withdraw <amount>/all/half",
  category: "economy",
  cooldown: 1,
  aliases: ["with", "w"],
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.sendError("Please provide an amount of money to withdraw!");
    }

    const myself = await findOneOrCreate(
      {
        id: message.author.id,
      },
      {
        id: message.author.id,
        lastUse: Date.now(),
        coins: 50,
        bank: 0,
        xp: 0,
        level: 1,
        items: [],
        bracket: 1,
      },
      EconomyModel,
    );

    const capacity = utils.getMaximumCompacity(myself);
    const toWithdraw = utils.parse(args[0]);

    if (toWithdraw === -1) {
      return message.sendError(
        `You provided an invalid amount! It must be higher than 0 ${client.e.coins}`,
      );
    }

    if (toWithdraw <= 0) {
      return message.sendError("Bruh... Cannot withdraw 0 or less coins 😐");
    }

    if (toWithdraw > myself.bank) {
      return message.sendError("You cannot withdraw more coins than you have!", "Cannot withdraw more than you have!");
    }

    await EconomyModel.updateOne(
      { id: message.author.id },
      { $inc: { coins: toWithdraw, bank: -toWithdraw } },
    );

    return message.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("#00FF00")
          .setDescription(
            `Withdrew **${toWithdraw} coins** to your wallet!`,
          )
          .setFooter({
            text: `${message.author.username}'s Bank: ${
              myself.bank - toWithdraw
            }/${capacity} 🏧`,
            iconURL: message.author.displayAvatarURL({
              dynamic: true,
            }),
          }),
      ],
    });
  },
};
