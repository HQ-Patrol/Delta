import { items } from "../../data/json/items.json";

export function findItem(itemName: string) {
	return items.find((i) => i.name.toLowerCase() === itemName || i.name2.toLowerCase() === itemName || i.alias.toLowerCase() === itemName);
}