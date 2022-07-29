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
  if (typeof itemName !== "string") return false;

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

/**
 * Adds item in bulk, reading from an object
 * @param {string} id id of user
 * @param {Object<string, number>} object object of items
 */
async function addItemsToUser(id, object) {
  if (typeof itemName !== "string") return;

  const itemsArray = Object.keys(object).map((a) => {
    const f = items.find((x) => x.name.toLowerCase() === a.name.toLowerCase());
    return {
      name: f.name,
      count: object[a],
      type: f.type,
      data: f.data,
      icon: f.icon,
    };
  });

  const user = await findOneOrCreate(
    { id },
    {
      id,
      lastUse: Date.now(),
      coins: 50,
      bank: 0,
      xp: 0,
      level: 1,
      items: itemsArray,
      bracket: 1,
    },
    EconomyModel,
  );

  if (user?.new) return true;

  if (!Array.isArray(user.items)) {
    await EconomyModel.updateOne(
      { id },
      {
        items: itemsArray,
      },
    );

    return true;
  }

  // User must have inventory, loop over and add & increment accordingly
  itemsArray.forEach((e) => {
    const invFind = user.items.find((i) => i.name.toLowerCase() === e.name.toLowerCase());
    if (invFind) {
      invFind.count += e.count;
      return;
    }
    // Just push into array
    user.items.push(e);
  });

  // Update
  await EconomyModel.updateOne({ id }, { items: user.items });

  return true;
}

module.exports = {
  addItemToUser,
  addItemsToUser,
};
