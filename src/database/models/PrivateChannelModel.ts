import { Schema, model } from "mongoose";

export interface IPrivateChannel {
  _id: string;
  channels: Array<object>;
  allowedRoles: Array<object>;
  categoryId: string;
}

const PrivateChannelSchema = new Schema<IPrivateChannel>({
  _id: String,
  channels: [
    {
      id: String,
      owner: String,
      members: [
        {
          id: String,
        },
      ],
    },
  ],
  allowedRoles: [{ id: String, addedBy: String }],
  categoryId: String,
});

export const PrivateChannelModel = model<IPrivateChannel>("PrivateChannel", PrivateChannelSchema);
