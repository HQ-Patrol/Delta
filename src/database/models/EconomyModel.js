const mongoose = require("mongoose");

const econ = new mongoose.Schema({
  id: String,
  lastUse: String,
  coins: { type: Number, index: -1 },
  bank: { type: Number, index: -1 },
  xp: { type: Number, index: -1 },
  level: Number,
  items: Array,
  default: [],
  bracket: Number,
});

module.exports = mongoose.model("stats", econ);
