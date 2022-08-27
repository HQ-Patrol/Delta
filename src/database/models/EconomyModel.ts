import { Schema, model } from "mongoose";
import { IUserItem } from "../../types/Item";

export interface IEconomy {
  id: string,
  lastUse: Date,
  coins: number,
  bank: number,
  xp: number,
  level: number,
  items: Array<IUserItem>,
  bracket: number,
}

const EconomySchema = new Schema({
  id: { type: String, ref: "User", index: true },
  lastUse: { type: Schema.Types.Date, default: Date.now() },
  coins: { type: Number, index: -1, default: 50 },
  bank: { type: Number, index: -1, default: 0 },
  xp: { type: Number, index: -1, default: 0 },
  level: { type: Number, default: 0 },
  items: { type: Array<IUserItem>, default: [] },
  bracket: { type: Number, default: 0 },
});

export const EconomyModel = model("stats", EconomySchema);
