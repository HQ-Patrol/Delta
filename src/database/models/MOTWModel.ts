import { Schema, model } from "mongoose";

const MOTWSchema = new Schema({
  userID: String,
  servers: [
    {
      serverID: String,
      MVs: { type: Number, index: -1 },
      MOTWs: { type: Number, index: -1 },
    },
  ],
  modV: { type: Number, index: -1 },
  motw: { type: Number, index: -1 },
});

export default model("MOTW", MOTWSchema);
