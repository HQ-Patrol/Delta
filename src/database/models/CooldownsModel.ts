import { Schema, model } from "mongoose"; 
 
export interface ICooldowns { 
  id: string, 
  daily: { 
    days: number, 
    last: number, 
  } 
  voting: {
    streak: number;
    lastVoted: Date;
    total: number;
  }
  nextWeekly: number, 
} 
 
const CooldownSchema = new Schema<ICooldowns>({ 
  id: String, 
  daily: { 
    days: { type: Number, default: 0 }, 
    last: { type: Number, default: 0 }, 
  }, 
  voting: {
    streak: Number,
    lastVoted: Date,
    total: Number,
  },
  nextWeekly: { type: Number, default: -1 }, 
}); 
 
export const CooldownsModel = model<ICooldowns>("cooldowns", CooldownSchema); 

