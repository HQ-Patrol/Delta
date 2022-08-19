"use strict";
const mongoose = require("mongoose");
const GuildCookieSchema = new mongoose.Schema({
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
module.exports = mongoose.model("guildCookies", GuildCookieSchema);
