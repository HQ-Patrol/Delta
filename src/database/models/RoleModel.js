const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  id: String,
  fight: Array,
  snap: Array,
  crucify: Array,
  rr: Array,
  fart: Array,
  tts: Array,
});

module.exports = mongoose.model("roles", RoleSchema);
