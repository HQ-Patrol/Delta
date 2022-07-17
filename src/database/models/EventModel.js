const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  X1: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  X2: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  X3: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  X4: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
});

module.exports = mongoose.model("event", EventSchema);
