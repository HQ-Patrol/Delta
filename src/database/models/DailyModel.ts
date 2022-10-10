/**
 * Model sorely used to transfer old dailies to the new CooldownsModel.
 * @deprecated 
*/

import { Schema, model } from "mongoose";

interface IDaily {
	id: string,
	days: number,
	next: number,
	resets: number,
	weeklyReset: number,
	boosterReset: string,
	voteReset: string,
	taxReturnReset: string,
	taxBenefitReset: string
}

// Daily schema / model.
const DailySchema = new Schema<IDaily>({
	id: String,
	days: Number,
	next: Number,
	resets: Number,
	weeklyReset: String,
	boosterReset: String,
	voteReset: String,
	taxReturnReset: String,
	taxBenefitReset: String
});

export const DailyModel = model<IDaily>('daily', DailySchema, 'daily');
