import { Schema, model } from "mongoose";

export interface IFight {
  id: string;
  fight: {
    total: number;
    success: number;
    fails: number;
    wl: number;
  };
  allow: boolean;
}

const FightSchema = new Schema<IFight>({
  id: String,

  fight: {
    total: Number,
    success: Number,
    fails: Number,
    wl: Number,
  },
  allow: Boolean,
});

export const FightModel = model<IFight>("fight", FightSchema);
