const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: String,
  blacklisted: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  bonk: {
    bonkedBy: [String],
    lastBonk: Number,
  },
  Biggercooldown: [
    {
      command: String,
      endCooldown: Number,
    },
  ],
  verified: { type: Boolean, default: false },
  certified: { type: Boolean, default: false },
  DMs: { type: Boolean, default: true },
  premLeft: String,
  hatched: {
    SHADOW: Boolean,
    DOG: Boolean,
    DUCK: Boolean,
    MONKEY: Boolean,
    LION: Boolean,
    GARGOYLE: Boolean,
  },
  voting: {
    streak: Number,
    lastVoted: Date,
    total: Number,
  },
});

module.exports = mongoose.model("User", UserSchema);
