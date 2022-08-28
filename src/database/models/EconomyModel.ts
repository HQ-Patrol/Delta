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

const econ = new Schema({
  id: { type: String },
  lastUse: { type: Schema.Types.Date, default: Date.now() },
  coins: { type: Number, index: -1, default: 0 },
  bank: { type: Number, index: -1, default: 0 },
  xp: { type: Number, index: -1, default: 0 },
  level: { type: Number, default: 0 },
  items: { type: Array, default: [] },
  bracket: { type: Number, default: 0 },
});

const Economy = model<IEconomy>("stats", econ);

export default Economy;