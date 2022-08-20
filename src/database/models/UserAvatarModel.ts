import { Schema, model } from "mongoose";

const AVATARSchema = new Schema({
  userID: String,
  username: String,
  av: String,
  caption: String,
  bday: String,
  description: String,
});

export default model("AVATAR", AVATARSchema);
