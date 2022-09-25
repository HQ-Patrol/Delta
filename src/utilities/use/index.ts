import { Collection } from "discord.js"
import * as Usable from "./Usable";

export interface UsableItem {
	supportsQuantity: boolean,
	// eslint-disable-next-line @typescript-eslint/ban-types
	use: Function;
}
const uses = new Collection<string, UsableItem>();

export function getUse(command: string) {
	return uses.get(command);
}

Usable.register(uses);