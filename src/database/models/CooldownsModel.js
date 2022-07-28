const Mongoose = require("mongoose");

const daily = new Mongoose.Schema({
  id: String,
  vote: {
    days: Number,
    last: { type: Number, default: 0 },
  },
});

module.exports = Mongoose.model("cooldowns", daily);
