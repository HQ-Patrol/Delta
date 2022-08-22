import { Schema, model } from "mongoose";

const EventSchema = new Schema({
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

export default model("event", EventSchema);
