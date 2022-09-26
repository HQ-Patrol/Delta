import findOneOrCreate from "../../database/functions/findOneOrCreate";
import UserMonthlyMissionsModel from "../../database/models/UserMonthlyMissionsModel";
import UserWeeklyMissionsModel from "../../database/models/UserWeeklyMissionsModel";

export async function doWeeklyMission(id: string, code: string, value = 1) {
	const find = await findOneOrCreate({ id }, { id }, UserWeeklyMissionsModel);
	
	const query: Record<string, Record<string, number | boolean>> = {};
	query[code] = { value: (find[code]?.value || 0) + value, prize: false, prizePlus: false };

	return UserWeeklyMissionsModel.updateOne({ id }, query);
}

export async function doMonthlyMission(id: string, code: string, value = 1) {
	const find = await findOneOrCreate({ id }, { id }, UserMonthlyMissionsModel);
	
	const query: Record<string, Record<string, number | boolean>> = {};
	query[code] = { value: (find[code]?.value || 0) + value, prize: false, prizePlus: false };

	return UserMonthlyMissionsModel.updateOne({ id }, query);
}