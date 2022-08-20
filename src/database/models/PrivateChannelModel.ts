import { Schema, model } from "mongoose";

const PrivateChannelSchema = new Schema({
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

export default model(
  "PrivateChannel",
  PrivateChannelSchema,
);
