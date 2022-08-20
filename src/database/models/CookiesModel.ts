import { Schema, model } from "mongoose";

const CookieSchema = new Schema({
  userID: String,
  cookies: { type: Number, index: -1 },
  totalgiven: Number,
  given: [
    {
      userID: String,
      count: { type: Number, index: -1 },
    },
  ],
  Blacklist: Boolean,
});

export default model("cookies", CookieSchema);
