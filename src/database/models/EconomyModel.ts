import { Schema, model } from "mongoose";

export interface IEconomy {
  id: string,
  lastUse: Date,
  coins: number,
  bank: number,
  xp: number,
  level: number,
  // TODO: create IItem
  items: Array<unknown>,
  bracket: number,
}

const EconomySchema = new Schema<IEconomy>({
  id: { type: String, ref: "User", index: true },
  lastUse: { type: Schema.Types.Date, default: Date.now() },
  coins: { type: Number, index: -1, default: 50 },
  bank: { type: Number, index: -1, default: 0 },
  xp: { type: Number, index: -1, default: 0 },
  level: { type: Number, default: 0 },
  items: { type: Array<unknown>, default: [] },
  bracket: { type: Number, default: 0 },
});

export const EconomyModel = model<IEconomy>("stats", EconomySchema);
