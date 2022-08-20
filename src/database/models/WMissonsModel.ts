import { Schema, model } from "mongoose";

const WMissionSchema = new Schema({
  id: String,
  Weekly: Array,
});

export default model("WMission", WMissionSchema);
