import { Schema, model } from "mongoose";

const daily = new Schema({
  id: String,
  vote: {
    days: { type: Number, default: 0 },
    last: { type: Number, default: 0 },
  },
  nextWeekly: { type: Number, default: -1 },
});

export default model("cooldowns", daily);
