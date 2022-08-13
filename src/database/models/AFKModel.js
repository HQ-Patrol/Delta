const mongoose = require("mongoose");

const AFKSchema = new mongoose.Schema({
  _id: String,
  afkMembers: [
    {
      id: {
        type: String,
      },
      reason: String,
    },
  ],
});

module.exports = mongoose.model("AFK", AFKSchema);
