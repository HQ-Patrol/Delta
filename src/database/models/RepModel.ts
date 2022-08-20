import { Schema, model } from "mongoose";

const REPSchema = new Schema({
  userID: String,
  username: String,
  repper: Array,
  Derepper: Array,
  rep: Number,
  repW: Number,
});

export default model("REP", REPSchema);
