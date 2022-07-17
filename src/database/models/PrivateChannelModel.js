const mongoose = require("mongoose");

const PrivateChannelSchema = new mongoose.Schema({
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

module.exports = mongoose.model(
  "PrivateChannel",
  PrivateChannelSchema,
);
