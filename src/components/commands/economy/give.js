const Discord = require("discord.js");

const utils = require("../../../utilities/query/inventory");
const { items } = require("../../../data/json/items.json");

const EconomyModel = require("../../../database/models/EconomyModel");

module.exports = {
  name: "give",
  description: "give items to other people",
  usage: "give @User <Item Name> | <quantity>",
  category: "economy",
  cooldown: 3,
  aliases: ["send"],
  example: "https://i.imgur.com/IQg5W87.gif",
  run: async (client, message, args) => {
    const target = message.mentions.users.first()
      || message.guild.members.cache.get(args[0])?.user;
    if (!target) return message.sendError("__**Usage:**__ `give @User <Item Name> | <quantity>`", "Please mention a user!");
    if (target.bot) return message.sendError("You can't send items to a bot..");
    if (target.id === message.author.id) return message.sendError("Sending items to yourself? We don't do that here.");

    // shift off mention
    args.shift();

    const parsed = utils.parseSpecialArguments(args.join(" "));
    if (parsed === null || parsed === false) return message.sendError("__**Usage:**__ `give @User <Item Name> | <quantity>`", "Please provide a valid item!");
    if (parsed === -1 || parsed === 0) return message.sendError("Please provide a quantity more than 0!");

    const item = parsed[0];
    const quantity = parsed[1];
    if (item?.data?.canBeTraded === false) return message.sendError("This item cannot be traded.");
    const user = await EconomyModel.findOne({ id: message.author.id }).lean();
    const find = user.items.find((i) => i.name === item.name);
    if (find == null || find?.count < quantity) return message.sendError(`You do not have enough ${item.icon} **${item.name}**! You need **${quantity - (find?.count || 0)}** more.`);

    // remove from user
    await utils.removeItemFromUser(message.author.id, item.name, quantity, user);
    // give item
    await utils.addItemToUser(target.id, item.name, quantity, user);

    return message.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setAuthor({ name: `${message.author.username} → ${target.username}` })
          .setDescription(`You have successfully given ${target} \`x${quantity}\` ${item.icon} **${item.name}**.`)
          .setColor("Green")
          .setTimestamp(),
      ],
    });
  },
};

module.exports.slash = {
  data: new Discord.SlashCommandBuilder()
    .setName("give")
    .setDescription(
      "Give items to each other! Use the transfer command to transfer coins",
    )
    .addUserOption((option) => option
      .setName("target")
      .setDescription("Who do you want to give your item(s) to?")
      .setRequired(true))
    .addIntegerOption((option) => option
      .setName("quantity")
      .setDescription(
        "How much of this item do you want to give to this user?",
      )
      .setRequired(true))
    .addStringOption((option) => option
      .setName("item")
      .setDescription(
        "Item name (case insensitive), supports aliases (e.g mb1 for Mystery Box 1)",
      )
      .setRequired(true)),
  async handler(client, interaction) {
    const target = interaction.options.getUser("target");
    if (target.bot) return interaction.sendError("You can't send items to a robot...");
    if (target.id === interaction.user.id) {
      return interaction.sendError(
        "Sending items to yourself? We don't do that here.",
      );
    }

    const quantity = interaction.options.getInteger("quantity");
    const itemArg = interaction.options.getString("item").toLowerCase();
    const item = items.find((i) => i.name.toLowerCase() === itemArg || i.name2.toLowerCase() === itemArg || i.alias.toLowerCase() === itemArg);

    if (quantity <= 0) return interaction.sendError("Please provide a quantity more than 0!");
    if (!item) return interaction.sendError("Please provide a valid item name or alias!");

    if (item?.data?.canBeTraded === false) return interaction.sendError("This item cannot be traded.");

    const user = await EconomyModel.findOne({ id: interaction.user.id }).lean();
    const find = user.items.find((i) => i.name === item.name);
    if (find == null || find?.count < quantity) {
      return interaction.sendError(
        `You do not have enough ${item.icon} **${item.name}**! You need **${
          quantity - (find?.count || 0)
        }** more.`,
      );
    }

    // remove from user
    await utils.removeItemFromUser(
      interaction.user.id,
      item.name,
      quantity,
      user,
    );
    // give item
    await utils.addItemToUser(target.id, item.name, quantity, user);

    return interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setAuthor({
            name: `${interaction.user.username} → ${target.username}`,
          })
          .setDescription(
            `You have successfully given ${target} \`x${quantity}\` ${item.icon} **${item.name}**.`,
          )
          .setColor("Green")
          .setTimestamp(),
      ],
    });
  },
};
