const mongoose = require("mongoose");

const WMissionSchema = new mongoose.Schema({
  id: String,
  Weekly: Array,
});

module.exports = mongoose.model("WMission", WMissionSchema);
