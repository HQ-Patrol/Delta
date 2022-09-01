import { items } from "../../data/json/items.json";
import { IItem } from "../../types/Item";

import findByUserId from "../../database/functions/economy/findUserById";
import { Economy, IEconomy } from "../../database/models/EconomyModel";

export async function addItemToUser(id: string, itemName: string, quantity: number) {
  if (typeof itemName !== "string") return false;
  if (!quantity) quantity = 1;

  // TODO: Make option to allow fuzzy
  const item = items.find((i) => i.name.toLowerCase() === itemName.toLowerCase()) as IItem;
  if (!item) return false;

  const user = await findByUserId(id);

  if (!Array.isArray(user.items)) {
    await Economy.updateOne(
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
    await Economy.updateOne(
      { id },
      {
        items: user.items,
      },
    );

    return true;
  }

  // Push into inventory
  await Economy.updateOne(
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

export async function addItemsToUser(id: string, object: Record<string, number>) {
  const itemsArray = Object.keys(object).map((a) => {
    const f = items.find((x) => x.name.toLowerCase() === a.toLowerCase()) as IItem;
    return {
      name: f.name,
      count: object[a],
      type: f.type,
      data: f.data,
      icon: f.icon,
    };
  });

  const user = await findByUserId(id);

  if (!Array.isArray(user.items)) {
    await Economy.updateOne(
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
  await Economy.updateOne({ id }, { items: user.items });

  return true;
}

export async function removeItemFromUser(id: string, item: string, quantity: number, existingDocument: IEconomy) {
  if (!quantity) quantity = 1;
  const user = existingDocument ?? (await findByUserId(id));

  const invFind = user.items.find((i) => i.name.toLowerCase() === item.toLowerCase());
  if (invFind) {
    invFind.count -= quantity;
    if (invFind.count < 0) invFind.count = 0;
  }

  // Update
  await Economy.updateOne({ id }, { items: user.items });

  return true;
}

export async function removeItemsFromUser(id: string, object: Record<string, number>, existingDocument: IEconomy) {
  const user = existingDocument ?? (await findByUserId(id));

  // User must have inventory, loop over and decrease accordingly
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const item in object) {
    const invFind = user.items.find((i: { name: string; }) => i.name.toLowerCase() === item.toLowerCase());
    if (invFind) {
      invFind.count -= object[item];
      if (invFind.count < 0) invFind.count = 0;
    }
  }

  // Update
  await Economy.updateOne({ id }, { items: user.items });

  return true;
}

export function parseSpecialArguments(string: unknown) {
  if (!string || typeof string !== "string" || string === "") return null;
  let split;
  if (string.includes("|")) {
    split = string.split("|");
  } else {
    split = string.split(" ");
  }

  const _item = split?.[0];
  const _quantity = split?.[1];

  if (!_item) return false;

  const quantity = parseInt(_quantity, 10);
  if (!Number.isInteger(quantity)) return -1;
  if (quantity <= 0) return 0;

  const item = items.find((i) => i.name.toLowerCase() === _item.trim().toLowerCase() || i.alias.toLowerCase() === _item.trim().toLowerCase()) as IItem;
  if (!item) return false;

  return [
    item,
    quantity,
  ];
}
