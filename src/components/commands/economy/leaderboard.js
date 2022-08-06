const Discord = require("discord.js");

const EconomyModel = require("../../../database/models/EconomyModel");

const AdvancedComponentMenu = require("../../../utilities/classes/AdvancedComponentMenu");
const { safe } = require("../../../utilities/messagePromiseSafe");

const emojis = require("../../../constants/emoji");

const placements = {
  1: "👑",
  2: "🥈",
  3: "🥉",
};

const locale = {
  xp: "XP",
  coins: "Coins",
  bank: "Bank",
};

const globalHeaders = {
  xp: "Global XP Leaderboard 💫",
  coins: "Global Money Leaderboard 💲",
};

const CACHE_LIMIT = 10;

function generateInteractions(mode, global) {
  let buttons = null;
  // add global/guild buttons
  if (mode !== "bank") {
    buttons = new Discord.ActionRowBuilder().setComponents(
      new Discord.ButtonBuilder()
        .setLabel("Guild")
        .setEmoji("⚔️")
        .setStyle("Success")
        .setCustomId("guild")
        .setDisabled(global === false),
      new Discord.ButtonBuilder()
        .setLabel("Global")
        .setCustomId("global")
        .setStyle("Success")
        .setEmoji("🌏")
        .setDisabled(global === true),
    );
  }

  // add select menu
  const selectMenu = new Discord.ActionRowBuilder()
    .setComponents(
      new Discord.SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Filter")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
          {
            label: "XP",
            description: "Sort for the XP leaderboard",
            emoji: "💫",
            default: mode === "xp",
            value: "xp",
          },
          {
            label: "Coins",
            description: "Sort for the Coins leaderboard",
            emoji: emojis.coins,
            default: mode === "coins",
            value: "coins",
          },
          {
            label: "Bank",
            description: "Sort for the Bank leaderboard",
            emoji: "🏦",
            default: mode === "bank",
            value: "bank",
          },
        ),
    );
  if (buttons) return [buttons, selectMenu];
  return [selectMenu];
}

async function generateUsers(client, cache, mode, global, data, guildIDs) {
  const CACHE_KEY = `${mode}_${global ? "global" : "guild"}`;
  if (!cache[CACHE_KEY]) {
    if (global) {
      cache[CACHE_KEY] = await Promise.all(
        data
          .sort((a, b) => b[mode] - a[mode])
          .slice(0, CACHE_LIMIT)
          .map(async (a) => ({
            tag: (await client.users.fetch(a.id)).tag,
            data: a[mode],
          })),
      );
    } else {
      cache[CACHE_KEY] = await Promise.all(
        data
          .filter((a) => guildIDs.includes(a.id))
          .sort((a, b) => b[mode] - a[mode])
          .slice(0, CACHE_LIMIT)
          .map(async (a) => ({
            tag: (await client.users.fetch(a.id)).tag,
            data: a[mode],
          })),
      );
    }
  }
}

module.exports = {
  name: "leaderboard",
  description: "Display whos the richest!",
  usage: "lb xp/coins/bank `or` lb global xp/coins",
  category: "economy",
  cooldown: 3,
  aliases: ["lb"],
  example: "https://i.imgur.com/nUfjfm9.gif",
  run: async (client, message, args) => {
    // TODO: Implement custom leaderboard caching, preferably using redis
    const loading = message.channel.send("<a:Loading:727148666837663765> Generating the leaderboards....");

    // TODO: implement better safe
    const all = await EconomyModel.find().lean();

    // generation
    let menu;
    let global = false; // defaults to guild
    let mode = "coins"; // defaults to coins
    const guildIDs = Array.from(message.guild.members.cache.keys());
    const cache = {};

    // generate init users
    await generateUsers(client, cache, mode, global, all, guildIDs);

    const embed = () => {
      const defaultEmbed = new Discord.EmbedBuilder()
        .setColor("Yellow")
        .setAuthor(global ? {
          name: globalHeaders[mode],
          iconURL: "https://i.imgur.com/fUzPD0f.gif",
        } : {
          name: `${message.guild.name}'s ${locale[mode]} leaderboard!`,
          iconURL: message.guild.iconURL(),
        });
      let field1 = "";
      let field2 = "";
      const data = cache[`${mode}_${global ? "global" : "guild"}`];

      for (let i = 0; i < data.length; i += 1) {
        if (i < 5) {
          // eslint-disable-next-line no-plusplus
          field1 += `${i < 3 ? placements[i + 1] : `\`#${i + 1}\``} **${data[i].tag}** ${emojis.wavyDash} ${data[i].data}\n`;
        } else {
          // eslint-disable-next-line no-plusplus
          field2 += `${`\`#${i + 1}\``} **${data[i].tag}** ${emojis.wavyDash} ${data[i].data}\n`;
        }
      }
      defaultEmbed.addFields(
        {
          name: "𝐓𝐎𝐏 𝟏𝟎",
          value: field1,
          inline: true,
        },
      );
      if (field2.length >= 1) {
        defaultEmbed.addFields({
          name: "\u200b",
          value: field2,
          inline: true,
        });
      }
      return defaultEmbed;
    };

    const handler = async (interaction) => {
      interaction.deferUpdate();
      const id = interaction.customId;

      mode = ["coins", "xp", "bank"].includes(interaction.values?.[0]) ? interaction.values[0] : mode;

      // global & guild
      global = (id === "global");

      await generateUsers(client, cache, mode, global, all, guildIDs);

      menu.embed = embed();
      menu.components = generateInteractions(mode, global);
      return menu.update();
    };

    loading.then(safe((msg) => {
      // create a new menu
      menu = new AdvancedComponentMenu(message, message.member)
        .setDefaultEmbed(embed())
        .setHandler(handler)
        .setComponents(generateInteractions(mode, global));

      menu.menuMessage = msg;
      menu.send();
    }));
  },
};
