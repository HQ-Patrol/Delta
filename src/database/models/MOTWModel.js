const mongoose = require("mongoose");

const MOTWSchema = mongoose.Schema({
  userID: String,
  servers: [
    {
      serverID: String,
      MVs: { type: Number, index: -1 },
      MOTWs: { type: Number, index: -1 },
    },
  ],
  modV: { type: Number, index: -1 },
  motw: { type: Number, index: -1 },
});

module.exports = mongoose.model("MOTW", MOTWSchema);
