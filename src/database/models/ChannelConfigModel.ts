import { Schema, model } from "mongoose";

const ChannelSchema = new Schema({
  _id: String,
  report: String,
  confessions: String,
  mod: String,
  simp: String,
});

export default model("channel", ChannelSchema);
