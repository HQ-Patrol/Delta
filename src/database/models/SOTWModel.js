const mongoose = require("mongoose");

const SOTWSchema = new mongoose.Schema({
  userID: String,
  servers: [
    {
      serverID: String,
      SVs: { type: Number, index: -1 },
      SOTWs: { type: Number, index: -1 },
    },
  ],
  simpV: { type: Number, index: -1 },
  sotw: { type: Number, index: -1 },
});

module.exports = mongoose.model("SOTW", SOTWSchema);
