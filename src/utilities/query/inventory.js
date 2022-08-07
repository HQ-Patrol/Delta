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
async function addItemToUser(id, itemName, quantity) {
  if (typeof itemName !== "string") return false;
  if (!quantity) quantity = 1;

  // TODO: Make option to allow fuzzy
  const item = items.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
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
 * @returns {Promise<boolean>}
 */
async function addItemsToUser(id, object) {
  const itemsArray = Object.keys(object).map((a) => {
    const f = items.find((x) => x.name.toLowerCase() === a.toLowerCase());
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

/**
 * Remove a specific item from a user.
 * @param {string} id
 * @param {string} item
 * @param {number} quantity
 * @param {object} existingQuery
 * @returns {Promise<boolean>}
 */
async function removeItemFromUser(id, item, quantity, existingQuery) {
  if (!quantity) quantity = 1;
  const user = existingQuery ?? (await EconomyModel.findOne({ id }).lean());

  const invFind = user.items.find((i) => i.name.toLowerCase() === item.toLowerCase());
  if (invFind) {
    invFind.count -= quantity;
    if (invFind.count < 0) invFind.count = 0;
  }

  // Update
  await EconomyModel.updateOne({ id }, { items: user.items });

  return true;
}

/**
 * Removes items from the user in bulk
 * Note: Only use this function when there is context that the user has the items!
 * @param {string} id id of user
 * @param {Object<string, number>} object object of items
 * @param {object} existingQuery
 * @returns {Promise<boolean>}
 */
async function removeItemsFromUser(id, object, existingQuery) {
  const user = existingQuery ?? (await EconomyModel.findOne({ id }).lean());

  // User must have inventory, loop over and decrease accordingly
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const item in object) {
    const invFind = user.items.find((i) => i.name.toLowerCase() === item.toLowerCase());
    if (invFind) {
      invFind.count -= object[item];
      if (invFind.count < 0) invFind.count = 0;
    }
  }

  // Update
  await EconomyModel.updateOne({ id }, { items: user.items });

  return true;
}

/**
 * Parses the unique Patrol Bot syntax: item name | quantity
 * @param {string} string
 */
function parseSpecialArguments(string) {
  if (!string || typeof string !== "string" || string === "") return null;
  let split;
  if (string.includes("|")) {
    split = string.split("|");
  } else {
    split = string.split(" ");
  }

  let item = split?.[0];
  let quantity = split?.[1];

  if (!item) return false;

  quantity = parseInt(quantity, 10);
  if (!Number.isInteger(quantity)) return -1;
  if (quantity <= 0) return 0;

  item = items.find((i) => i.name.toLowerCase() === item.trim().toLowerCase() || i.alias.toLowerCase() === item.trim().toLowerCase());
  if (!item) return false;

  return [
    item,
    quantity,
  ];
}

module.exports = {
  addItemToUser,
  addItemsToUser,
  removeItemFromUser,
  removeItemsFromUser,
  parseSpecialArguments,
};
