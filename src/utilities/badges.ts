import { badges } from "../data/json/badges.json";
import findUserById from "../database/functions/economy/findUserById";
import { BadgesModel } from "../database/models/BadgesModel";
import { CooldownsModel } from "../database/models/CooldownsModel";
import { RepModel } from "../database/models/RepModel";
import { IBadge } from "../types/Badge";

export function resolve(name: string): IBadge | undefined {
	return badges.find((badge: IBadge) => badge.name.toLowerCase() === name.toLowerCase());
}

export async function check(id: string) {
	const badgesArray: IBadge[] = [];
	
	const Reps = await RepModel.findOne({ userID: id }).lean() || { rep: 0 };
	const Economy = await findUserById(id);
	const Daily = (await CooldownsModel.findOne({ id: id }).lean())?.daily?.days || 0;

	if(Daily >= 25) badgesArray.push(resolve("claimer")!);
	if(Daily >= 50) badgesArray.push(resolve("claim guru")!);

	if(Economy.level >= 10) badgesArray.push(resolve("virgin")!);
	if(Economy.level >= 25) badgesArray.push(resolve("hackerman")!);
	if(Economy.level >= 50) badgesArray.push(resolve("pimp")!);

	
	if((Economy.coins + Economy.bank) >= 1000000) badgesArray.push(resolve("million dollar baby")!);
	if((Economy.coins + Economy.bank) >= 1000000000) badgesArray.push(resolve("billion dollar baby")!);

	if(Reps.rep >= 250) badgesArray.push(resolve("admirable")!);
	if(Reps.rep >= 1000) badgesArray.push(resolve("xi's assitant")!);
	if(Reps.rep >= 5000) badgesArray.push(resolve("representative (communist party of china)")!);
	
	const badges = await BadgesModel.findOne({ id }).lean();

	if(!badges) {
		return new BadgesModel({
			id,
			badges: badgesArray
		}).save();
	} else {
		return BadgesModel.updateOne({ id },
		{
			$addToSet: { badges: { $each: badgesArray } }
		});
	}
}