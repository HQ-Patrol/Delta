import { Schema, model } from "mongoose";

export interface IGuildCommand {
  name: string,
  count: number,
  disabled: boolean
}

export interface IGuild {
  _id: string,
  name: string,
  ownerId: string,
  ownerTag: string,
  prefix: string,
  serverCooldown: number,
  premium: boolean,
  commands: Array<IGuildCommand>,
  invite: string,
  chibi: boolean,
  nsfw: boolean,
  crucify: number,
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

export const GuildModel = model<IGuild>("Guild", GuildSchema);
