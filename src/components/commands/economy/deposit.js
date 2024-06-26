const Discord = require("discord.js");

const findOneOrCreate = require("../../../database/functions/findOneOrCreate");
const EconomyModel = require("../../../database/models/EconomyModel");

const utils = require("../../../utilities/query/economy");

module.exports = {
  name: "deposit",
  description: "Deposit your money to avoid it being stolen",
  usage: "deposit <amount>/all/half",
  category: "economy",
  cooldown: 1,
  aliases: ["dep", "d"],
  run: async (client, message, args) => {
    if (!args[0]) { return message.sendError("Please provide an amount of money to deposit!"); }

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
    let toDep = utils.parse(args[0], myself.coins, args[0]);

    if (toDep === -1) {
      return message.sendError(`You provided an invalid amount! It must be higher than 0 ${client.e.coins}`);
    }

    if (toDep <= 0) {
      return message.sendError("Bruh... Cannot deposit 0 or less coins 😐");
    }

    if (toDep > myself.coins) {
      return message.sendError("Try depositing money you actually have. LMAO.", "You cannot deposit more than you have!");
    }

    if ((toDep + myself.bank) > capacity) {
      // Bank Limit Hit

      // Calculate remaining space if any
      const remaining = capacity - myself.bank;
      if (remaining <= 0) {
        return message.sendError(`You have already exceeded your bank capacity limit of **${capacity}** coins. You cannot deposit any more!`, "You may not exceed your bank limits!");
      }

      // Only remaining
      toDep = Math.floor(remaining);
      await EconomyModel.updateOne(
        { id: message.author.id },
        { $inc: { coins: -toDep, bank: toDep } },
      );
      return message.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Bank Limit Hit‼")
            .setDescription(
              `Deposited **${toDep} coins** to your bank ${client.e.coins}\n⤳ \`ɪɴᴄʀᴇᴀꜱᴇ ʏᴏᴜʀ ʟɪᴍɪᴛ ʙʏ ʟᴇᴠᴇʟɪɴɢ ᴜᴘ!\`📈`,
            )
            .setFooter({
              text: `${message.author.username}'s Bank: ${
                myself.bank + toDep
              }/${capacity} 🏧`,
              iconURL: message.author.displayAvatarURL({
                dynamic: true,
              }),
            }),
        ],
      });
    }

    await EconomyModel.updateOne(
      { id: message.author.id },
      { $inc: { coins: -toDep, bank: toDep } },
    );

    return message.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("#00FF00")
          .setDescription(
            `Deposited **${toDep} coins** to your bank!`,
          )
          .setFooter({
            text: `${message.author.username}'s Bank: ${
              myself.bank + toDep
            }/${capacity} 🏧`,
            iconURL: message.author.displayAvatarURL({
              dynamic: true,
            }),
          }),
      ],
    });
  },
};

module.exports.slash = {
  data: new Discord.SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit coins into your bank account")
    .addStringOption((option) => option
      .setName("amount")
      .setDescription("An integer, an alias (e.g 2k) or 'half'/'max'")
      .setRequired(true)),
  async handler(client, interaction) {
    const myself = await findOneOrCreate(
      {
        id: interaction.user.id,
      },
      {
        id: interaction.user.id,
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
    const argument = interaction.options.getString("amount");
    let toDep = utils.parse(argument, myself.coins, argument);

    if (toDep === -1) {
      return interaction.sendError(
        `You provided an invalid amount! It must be higher than 0 ${client.e.coins}`,
      );
    }

    if (toDep <= 0) {
      return interaction.sendError("Bruh... Cannot deposit 0 or less coins 😐");
    }

    if (toDep > myself.coins) {
      return interaction.sendError(
        "Try depositing money you actually have. LMAO.",
        "You cannot deposit more than you have!",
      );
    }

    if (toDep + myself.bank > capacity) {
      // Bank Limit Hit

      // Calculate remaining space if any
      const remaining = capacity - myself.bank;
      if (remaining <= 0) {
        return interaction.sendError(`You have already exceeded your bank capacity limit of **${capacity}** coins. You cannot deposit any more!`, "You may not exceed your bank limits!");
      }

      // Only remaining
      toDep = Math.floor(remaining);
      await EconomyModel.updateOne(
        { id: interaction.user.id },
        { $inc: { coins: -toDep, bank: toDep } },
      );
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Bank Limit Hit‼")
            .setDescription(
              `Deposited **${toDep} coins** to your bank ${client.e.coins}\n⤳ \`ɪɴᴄʀᴇᴀꜱᴇ ʏᴏᴜʀ ʟɪᴍɪᴛ ʙʏ ʟᴇᴠᴇʟɪɴɢ ᴜᴘ!\`📈`,
            )
            .setFooter({
              text: `${interaction.user.username}'s Bank: ${
                myself.bank + toDep
              }/${capacity} 🏧`,
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            }),
        ],
      });
    }

    await EconomyModel.updateOne(
      { id: interaction.user.id },
      { $inc: { coins: -toDep, bank: toDep } },
    );

    return interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor("#00FF00")
          .setDescription(`Deposited **${toDep} coins** to your bank!`)
          .setFooter({
            text: `${interaction.user.username}'s Bank: ${
              myself.bank + toDep
            }/${capacity} 🏧`,
            iconURL: interaction.user.displayAvatarURL({
              dynamic: true,
            }),
          }),
      ],
    });
  },
};
