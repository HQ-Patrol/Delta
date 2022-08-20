import { Schema, model } from "mongoose";

const SOTWSchema = new Schema({
  userID: String,
  servers: [
    {
      serverID: String,
      SVs: { type: Number, index: -1 },
      SOTWs: { type: Number, index: -1 },
    },
  ],
  simpV: { type: Number, index: -1 },
  sotw: { type: Number, index: -1 },
});

export default model("SOTW", SOTWSchema);
