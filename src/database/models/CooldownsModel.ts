import { Schema, model } from "mongoose";

export interface ICooldowns {
  id: String,
	days: Number,
	next: Number,
	resets: Number,
	weeklyReset: String,
	boosterReset: String,
	voteReset: Number,
	taxReturnReset: String,
	taxBenefitReset: String
}

const CooldownSchema = new Schema<ICooldowns>({
  id: String,
  days: { 
    type: Number, 
    default: 0
  }
});

export const CooldownsModel = model<ICooldowns>("cooldowns", CooldownSchema);
