const Mongoose = require("mongoose");

const daily = new Mongoose.Schema({
  id: String,
  days: Number,
  last: { type: Number, default: 0 },
  weeklyReset: String,
  boosterReset: String,
  voteReset: String,
  taxReturnReset: String,
  taxBenefitReset: String,
});

module.exports = Mongoose.model("daily", daily);
