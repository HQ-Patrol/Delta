/* eslint-disable consistent-return */

const { Snowflake } = require("discord.js");
const { items } = require("../../data/json/items.json");
const findOneOrCreate = require("../../database/functions/findOneOrCreate");
const EconomyModel = require("../../database/models/EconomyModel");

/**
 * Adds an item to the user.
 * @param {Snowflake | String} id
 * @param {string} itemName
 * @param {number} [quantity]
 * @returns {Promise<boolean>}
 */
async function addItemToUser(id, itemName, quantity = 1) {
  if (typeof itemName !== "string") return;

  // TODO: Make option to allow fuzzy
  const item = items.find((i) => i.name === itemName.toLowerCase());
  if (!item) return false;

  const user = await findOneOrCreate(
    { id },
    {
      id,
      lastUse: Date.now(),
      coins: 50,
      bank: 0,
      xp: 0,
      level: 1,
      items: [
        {
          name: item.name,
          count: quantity,
          type: item.type,
          data: item.data,
          icon: item.icon,
        },
      ],
      bracket: 1,
    },
    EconomyModel,
  );

  if (user?.new) return true;

  if (!Array.isArray(user.items)) {
    await EconomyModel.updateOne(
      { id },
      {
        items: [
          {
            name: item.name,
            count: quantity,
            type: item.type,
            data: item.data,
            icon: item.icon,
          },
        ],
      },
    );

    return true;
  }

  // User must have inventory
  const itemFind = user.items.find((i) => i.name.toLowerCase() === item.name.toLowerCase());
  if (itemFind) {
    // Add quantity instead
    itemFind.count += quantity;
    await EconomyModel.updateOne(
      { id },
      {
        items: user.items,
      },
    );

    return true;
  }

  // Push into inventory
  await EconomyModel.updateOne(
    { id },
    {
      $push: {
        items: {
          name: item.name,
          count: quantity,
          type: item.type,
          data: item.data,
          icon: item.icon,
        },
      },
    },
  );

  return true;
}

module.exports = {
  addItemToUser,
};
