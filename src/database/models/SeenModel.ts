import { Schema, model } from "mongoose";

const SeenSchema = new Schema({
  _id: {
    type: String,
  },
  lastSeens: [
    {
      date: {
        type: Date,
        index: true,
      },
      guildId: String,
    },
  ],
});

export default model("Seen", SeenSchema);
