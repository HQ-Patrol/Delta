const mongoose = require("mongoose");

const AVATARSchema = mongoose.Schema({
  userID: String,
  username: String,
  av: String,
  caption: String,
  bday: String,
  description: String,
});

module.exports = mongoose.model("AVATAR", AVATARSchema);
