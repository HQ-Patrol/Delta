const mongoose = require("mongoose");
const {Schema} = mongoose;

const econ = new mongoose.Schema({
  id: {type: String, ref: "User", index: true},
  lastUse: {type: Schema.Types.Date, default: Date.now()},
  coins: { type: Number, index: -1 },
  bank: { type: Number, index: -1 },
  xp: { type: Number, index: -1 },
  level: Number,
  items: Array,
  default: [],
  bracket: Number,
});

module.exports = mongoose.model("stats", econ);
