import { Schema, model } from "mongoose";

export interface IChannel {
  _id: string,
  report: string,
  confessions: string,
  mod: string,
  simp: string,
}

const ChannelSchema = new Schema<IChannel>({
  _id: String,
  report: String,
  confessions: String,
  mod: String,
  simp: String,
});

export const ChannelModel = model<IChannel>("channel", ChannelSchema);
