import findOneOrCreate from "../../database/functions/findOneOrCreate";
import UserMonthlyMissionsModel from "../../database/models/UserMonthlyMissionsModel";
import UserWeeklyMissionsModel from "../../database/models/UserWeeklyMissionsModel";

export async function doWeeklyMission(id: string, code: string, value = 1) {
	await findOneOrCreate({ id }, { id }, UserWeeklyMissionsModel);
	
	const query: Record<string, Record<string, number>> = {};
	query[code] = { value };

	return UserWeeklyMissionsModel.updateOne({ id }, { $inc: query });
}

export async function doMonthlyMission(id: string, code: string, value = 1) {
	await findOneOrCreate({ id }, { id }, UserMonthlyMissionsModel);
	
	const query: Record<string, Record<string, number>> = {};
	query[code] = { value };

	return UserMonthlyMissionsModel.updateOne({ id }, { $inc: query });
}