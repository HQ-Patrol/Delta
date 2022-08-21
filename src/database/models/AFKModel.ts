import { Schema, model } from "mongoose";

export interface IAfk {
  _id: string,
  afkMembers: Array<object>
}

const AFKSchema = new Schema<IAfk>({
  _id: String,
  afkMembers: [
    {
      id: {
        type: String,
        ref: "User",
      },
      reason: String,
    },
  ],
});

export const AFKModel = model<IAfk>("AFK", AFKSchema);


