import { model, Schema } from "mongoose";

interface IGuild {
  _id: string,
  name: string,
  ownerId: string,
  ownerTag: string,

  prefix: string,
  serverCooldown: number,
  premium: boolean,

  commands: string,
  invite: string,
  chibi: boolean,
  nsfw: boolean,
  crucify: number
}

const GuildSchema = new Schema<IGuild>({
  _id: String,
  name: String,
  ownerId: String,
  ownerTag: String,

  prefix: { type: String, default: process.env.DEFAULT_PREFIX },
  serverCooldown: { type: Number, default: 0 },
  premium: { type: Boolean, default: false },

  commands: [
    {
      name: String,
      count: { type: Number, default: 0 },
      disabled: { type: Boolean, default: false },
    },
  ],
  invite: String,
  chibi: Boolean,
  nsfw: Boolean,
  crucify: Number,
});

export default model("Guild", GuildSchema);
