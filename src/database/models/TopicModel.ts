import { Schema, model } from "mongoose";

export interface ITopic {
  UserID: string,
  topicNo: number,
  topic: string,
  count: number,
}

const TopicSchema = new Schema<ITopic>({
  UserID: String,
  topicNo: Number,
  topic: String,
  count: Number,
});

export const TopicModel = model<ITopic>("topic", TopicSchema);
