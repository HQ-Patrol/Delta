import { Schema, model } from "mongoose";
import items from "../../data/interface/items";

interface IEconomy {
  id: string;
  lastUse: Schema.Types.Date;
  coins: number;
  bank: number;
  xp: number;
  level: number;
  items: Array<items>;
  bracket: number;
}

const EconomySchema = new Schema({
  id: { type: String, ref: "User", index: true },
  lastUse: { type: Schema.Types.Date, default: Date.now() },
  coins: { type: Number, index: -1, default: 0 },
  bank: { type: Number, index: -1, default: 0 },
  xp: { type: Number, index: -1, default: 0 },
  level: { type: Number, default: 0 },
  items: { type: Array, default: [] },
  bracket: { type: Number, default: 0 },
});

export const EconomyModel = model<IEconomy>("stats", EconomySchema);