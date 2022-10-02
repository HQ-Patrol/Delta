import { Collection } from "discord.js"
import * as Usable from "./Usable";
import * as Rob from "./Rob";
import * as Collectibles from "./Collectibles";
import * as Badges from "./Badges";
import * as Pets from "./Pets";
import * as Special from "./Special";

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
Collectibles.register(uses);
Badges.register(uses);
Pets.register(uses);
Special.register(uses);