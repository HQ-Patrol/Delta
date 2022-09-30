<<<<<<< HEAD
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
=======
import { Schema, model } from "mongoose"; 
 
export interface ICooldowns { 
  id: string, 
  daily: { 
    days: number, 
    last: number, 
  } 
  vote: { 
    days: number, 
    last: number, 
  }, 
  nextWeekly: number, 
} 
 
const CooldownSchema = new Schema<ICooldowns>({ 
  id: String, 
  daily: { 
    days: { type: Number, default: 0 }, 
    last: { type: Number, default: 0 }, 
  }, 
  vote: { 
    days: { type: Number, default: 0 }, 
    last: { type: Number, default: 0 }, 
  }, 
  nextWeekly: { type: Number, default: -1 }, 
}); 
 
export const CooldownsModel = model<ICooldowns>("cooldowns", CooldownSchema); 
>>>>>>> 7929a8af692a5c03b9e57174f36053babec7fbdd
