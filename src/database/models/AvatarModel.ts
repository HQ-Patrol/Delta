import { Schema, model } from "mongoose";

export interface IAvatar {
  userID: string;
  username: string;
  av: string;
  caption: string;
  bday: string;
  description: string;
}

const AvatarSchema = new Schema<IAvatar>({
  userID: String,
  username: String,
  av: String,
  caption: String,
  bday: String,
  description: String,
});

export const AvatarModel = model<IAvatar>("avatars", AvatarSchema);
