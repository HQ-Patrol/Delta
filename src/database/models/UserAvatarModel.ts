import { Schema, model } from "mongoose";

export interface IAvatar {
  userId: string;
  username: string;
  av: string;
  caption: string;
  bday: string;
  description: string;
}

const AvatarSchema = new Schema<IAvatar>({
  userId: String,
  username: String,
  av: String,
  caption: String,
  bday: String,
  description: String,
});

export const AvatarModel = model<IAvatar>("AVATAR", AvatarSchema);
