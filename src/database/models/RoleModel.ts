import { Schema, model } from "mongoose";

const RoleSchema = new Schema({
  id: String,
  fight: Array,
  snap: Array,
  crucify: Array,
  rr: Array,
  fart: Array,
  tts: Array,
});

export default model("roles", RoleSchema);
