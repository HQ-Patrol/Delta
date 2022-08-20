import { Schema, model } from "mongoose";

const GuildCookieSchema = new Schema({
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

export default model("guildCookies", GuildCookieSchema);
