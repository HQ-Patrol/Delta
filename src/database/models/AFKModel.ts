import { Schema, model } from "mongoose";

 interface IAfk {
  _id: string,
  afkMembers: AfkDetails[]
}

interface AfkDetails {
  _id: string;
  reason: string
}

const AFKSchema = new Schema<IAfk>({
  _id: String,
  afkMembers: [],
});

export const AFKModel = model<IAfk>("AFK", AFKSchema);
