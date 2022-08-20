import { Schema, model } from "mongoose";

const AFKSchema = new Schema({
  _id: String,
  afkMembers: [
    {
      id: {
        type: String,
        ref: "User",
      },
      reason: String,
    },
  ],
});

export default model("AFK", AFKSchema);
