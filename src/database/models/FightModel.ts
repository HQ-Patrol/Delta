import { Schema, model } from "mongoose";

const FightSchema = new Schema({
  _id: String,
  fight: {
    total: Number,
    success: Number,
    fails: Number,
    wl: Number,
  },
  allow: Boolean,
});

export default model("fight", FightSchema);
