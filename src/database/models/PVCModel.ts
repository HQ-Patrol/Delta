import { Schema, model } from "mongoose";

const PVCSchema = new Schema({
  id: String,
  bosses: [
    {
      completed: Boolean,
      bossID: String,
      cooldown: Number,
      win: { type: Number, default: 0 },
      loss: { type: Number, default: 0 },
    },
  ],
});

export default model("pvc", PVCSchema);
