import { Schema, model } from "mongoose";

const TopicSchema = new Schema({
  UserID: String,
  topicNo: Number,
  topic: String,
  count: Number,
});

export default model("topic", TopicSchema);
