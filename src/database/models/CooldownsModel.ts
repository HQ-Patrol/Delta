import { Schema, model } from "mongoose";

export interface ICooldowns {
  id: string,
  vote: {
    days: number,
    last: number,
  },
  nextWeekly: number,
}

const CooldownSchema = new Schema<ICooldowns>({
  id: String,
  vote: {
    days: { type: Number, default: 0 },
    last: { type: Number, default: 0 },
  },
  nextWeekly: { type: Number, default: -1 },
});

export const CooldownsModel = model<ICooldowns>("cooldowns", CooldownSchema);