import { Schema, model } from "mongoose";

const econ = new Schema({
  id: { type: String, ref: "User", index: true },
  lastUse: { type: Schema.Types.Date, default: Date.now() },
  coins: { type: Number, index: -1, default: 0 },
  bank: { type: Number, index: -1, default: 0 },
  xp: { type: Number, index: -1, default: 0 },
  level: { type: Number, default: 0 },
  items: { type: Array, default: 0 },
  bracket: { type: Number, default: 0 },
});

export default model("stats", econ);
