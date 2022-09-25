import { Schema, model } from "mongoose";

export interface IGuildCookie {
  serverID: string,
  users: [
    {
      userID: string,
      cookieGot: number,
      cookieSent: number,
      cookieWeekly: number,
    },
  ],
  AllowedRoles: string,
  BannedUsers: string,
  Weekly: boolean,
}

const GuildCookieSchema = new Schema<IGuildCookie>({
  serverID: String,
  users: [
    {
      userID: String,
      cookieGot: { type: Number, index: -1 },
      cookieSent: { type: Number, index: -1 },
      cookieWeekly: { type: Number, index: -1 },
    },
  ],
  AllowedRoles: String,
  BannedUsers: String,
  Weekly: { type: Boolean, default: false },
});

export const GuildCookieModel = model<IGuildCookie>("guildCookies", GuildCookieSchema);
