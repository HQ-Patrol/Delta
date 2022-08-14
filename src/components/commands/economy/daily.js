const Discord = require("discord.js");
const ms = require("ms");
const prettyMs = require("pretty-ms");

const EconomyModel = require("../../../database/models/EconomyModel");
const CooldownsModel = require("../../../database/models/CooldownsModel");

const findOneOrCreate = require("../../../database/functions/findOneOrCreate");

const { addItemsToUser } = require("../../../utilities/query/inventory");
const { safe } = require("../../../utilities/messagePromiseSafe");

const { items } = require("../../../data/json/items.json");

const rewards = {
  10: {
    "Mystery Box 1": 1,
    Cookie: 1,
  },
  25: {
    "Soft Boiled Egg": 1,
    Cookie: 1,
  },
  50: {
    "Soft Boiled Egg": 1,
    "Mystery Box 1": 1,
  },
  75: {
    "Mystery Box 2": 1,
    Cookie: 1,
  },
  100: {
    "Mystery Box 2": 1,
    "Soft Boiled Egg": 1,
  },
  150: {
    "Mystery Box 2": 2,
    "Soft Boiled Egg": 2,
  },
  200: {
    "Mystery Box 3": 1,
    Cookie: 1,
  },
  250: {
    "Mystery Box 3": 2,
    Cookie: 1,
  },
  365: {
    "Mystery Box 3": 2,
    "Medium Boiled Egg": 1,
  },
  500: {
    "Mystery Box XXX": 1,
    Cookie: 1,
  },
};

const DAILY_COOLDOWN = ms("20h");
const STREAK_EXPIRE = ms("24h");

module.exports = {
  name: "daily",
  description: "Get your daily dose of a good stack of coins",
  usage: "daily",
  category: "economy",
  cooldown: 1,
  run: async (client, message, args) => {
    const Daily = await findOneOrCreate(
      { id: message.author.id },
      { id: message.author.id },
      CooldownsModel,
    );

    const lastVoted = Daily.vote.last;
    if (Date.now() - lastVoted < DAILY_COOLDOWN) {
      // Cooldown
      return message.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ name: "You have already claimed your daily!", iconURL: message.author.displayAvatarURL() })
            .setDescription(`${client.e.exclamation}Your next daily reward is in:`)
            .addDescription(`**${prettyMs(lastVoted + DAILY_COOLDOWN - Date.now(), { verbose: true })}**`)
            .setTimestamp()
            .setColor("Random"),
        ],
      });
    }

    let COINS = 1000 + (Daily.vote.days * 375);
    let newStreak = (Daily.vote.days ?? 0) + 1;

    let messageContent = "";

    if (message.userData.premium) {
      messageContent = "**DOUBLE COINS!** Thank you for supporting us and having Patrol Bot Premium.";
      // coins x2
      COINS *= 2;
    }

    if (Date.now() > lastVoted + STREAK_EXPIRE && lastVoted !== -1 && Daily.vote.days > 10) {
      // Lost
      messageContent = `You lost your **${Daily.vote.days}** daily streak.. :cry:`;
      newStreak = 1;
    }

    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: "Daily Coins", iconURL: message.author.displayAvatarURL() })
      .setDescription(`**${COINS}** ${client.e.coins} has just been added to your wallet!`)
      .addDescription("*Get more special rewards by voting or using our **lootboxes**!*")
      .addDescription(`\n${client.e.exclamation}Your next daily reward is in:`)
      .addDescription(`**${prettyMs(DAILY_COOLDOWN, { verbose: true })}**`)
      .setFooter({ text: `Streak: ${newStreak}` })
      .setTimestamp()
      .setColor("Random");

    let rew;
    if (newStreak >= 10) {
      // eligible, find range
      Object.keys(rewards).forEach((e, i, a) => {
        if (!rew && client.utils.inRange(newStreak, e, parseInt(a?.[i + 1], 10))) {
          rew = rewards[e];
        }
      });
    }

    if (rew) {
      embed.addDescription(`\n**REWARDS** *(Streak ${newStreak})*:`);
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const r in rew) {
        embed.addDescription(`x${rew[r]} **${r}** ${(items.find((a) => a.name === r))?.icon || ""}`);
      }
    }

    const reply = message.reply({
      embeds: [embed],
      content: messageContent,
    });

    return reply.then(safe(async (msg) => {
      // add items
      if (rew) await addItemsToUser(msg.author.id, rew);
      // add coins
      await EconomyModel.updateOne({ id: msg.author.id }, { $inc: { coins: COINS } });
      // add streak
      await CooldownsModel.updateOne(
        { id: msg.author.id },
        {
          $set: {
            vote: {
              days: newStreak,
              last: Date.now(),
            },
          },
        },
      );
    }));
  },
};

module.exports.slash = {
  data: new Discord.SlashCommandBuilder()
    .setName("daily")
    .setDMPermission(false)
    .setDescription("Claim your daily coins!"),
  async handler(client, interaction) {
    const Daily = await findOneOrCreate(
      { id: interaction.user.id },
      { id: interaction.user.id },
      CooldownsModel,
    );

    const lastVoted = Daily.vote.last;
    if (Date.now() - lastVoted < DAILY_COOLDOWN) {
      // Cooldown
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ name: "You have already claimed your daily!", iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${client.e.exclamation}Your next daily reward is in:`)
            .addDescription(`**${prettyMs(lastVoted + DAILY_COOLDOWN - Date.now(), { verbose: true })}**`)
            .setTimestamp()
            .setColor("Random"),
        ],
      });
    }

    let COINS = 1000 + (Daily.vote.days * 375);
    let newStreak = (Daily.vote.days ?? 0) + 1;

    let messageContent = "";

    if (interaction.userData.premium) {
      messageContent = "**DOUBLE COINS!** Thank you for supporting us and having Patrol Bot Premium.";
      // coins x2
      COINS *= 2;
    }

    if (Date.now() > lastVoted + STREAK_EXPIRE && lastVoted !== -1 && Daily.vote.days > 10) {
      // Lost
      messageContent = `You lost your **${Daily.vote.days}** daily streak.. :cry:`;
      newStreak = 1;
    }

    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: "Daily Coins", iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`**${COINS}** ${client.e.coins} has just been added to your wallet!`)
      .addDescription("*Get more special rewards by voting or using our **lootboxes**!*")
      .addDescription(`\n${client.e.exclamation}Your next daily reward is in:`)
      .addDescription(`**${prettyMs(DAILY_COOLDOWN, { verbose: true })}**`)
      .setFooter({ text: `Streak: ${newStreak}` })
      .setTimestamp()
      .setColor("Random");

    let rew;
    if (newStreak >= 10) {
      // eligible, find range
      Object.keys(rewards).forEach((e, i, a) => {
        if (!rew && client.utils.inRange(newStreak, e, parseInt(a?.[i + 1], 10))) {
          rew = rewards[e];
        }
      });
    }

    if (rew) {
      embed.addDescription(`\n**REWARDS** *(Streak ${newStreak})*:`);
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const r in rew) {
        embed.addDescription(`x${rew[r]} **${r}** ${(items.find((a) => a.name === r))?.icon || ""}`);
      }
    }

    // add items
    if (rew) await addItemsToUser(interaction.user.id, rew);
    // add coins
    await EconomyModel.updateOne({ id: interaction.user.id }, { $inc: { coins: COINS } });
    // add streak
    await CooldownsModel.updateOne(
      { id: interaction.user.id },
      {
        $set: {
          vote: {
            days: newStreak,
            last: Date.now(),
          },
        },
      },
    );

    return interaction.reply({
      embeds: [embed],
      content: messageContent,
    });
  },
};
