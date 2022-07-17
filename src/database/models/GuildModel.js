const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
  _id: String,
  name: String,
  ownerId: String,
  ownerTag: String,

  prefix: { type: String, default: process.env.DEFAULT_PREFIX },
  serverCooldown: { type: Number, default: 0 },
  premium: { type: Boolean, default: false },

  commands: [
    {
      name: String,
      count: { type: Number, default: 0 },
      disabled: { type: Boolean, default: false },
    },
  ],
  invite: String,
  chibi: Boolean,
  nsfw: Boolean,
  crucify: Number,
});

module.exports = mongoose.model("Guild", GuildSchema);
