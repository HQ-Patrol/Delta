const mongoose = require("mongoose");

const FightSchema = new mongoose.Schema({
  _id: String,
  fight: {
    total: Number,
    success: Number,
    fails: Number,
    wl: Number,
  },
  allow: Boolean,
});

module.exports = mongoose.model("fight", FightSchema);
