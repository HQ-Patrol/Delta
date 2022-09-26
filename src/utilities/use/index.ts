import { Collection } from "discord.js"
import * as Usable from "./Usable";
import * as Rob from "./Rob";

export interface UsableItem {
	supportsQuantity?: boolean,
	waitForSuccess?: boolean
	// eslint-disable-next-line @typescript-eslint/ban-types
	use: Function;
}
const uses = new Collection<string, UsableItem>();

export function getUse(command: string) {
	return uses.get(command);
}

Usable.register(uses);
Rob.register(uses);