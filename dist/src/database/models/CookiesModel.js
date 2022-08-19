"use strict";
const mongoose = require("mongoose");
const CookieSchema = new mongoose.Schema({
    userID: String,
    cookies: { type: Number, index: -1 },
    totalgiven: Number,
    given: [
        {
            userID: String,
            count: { type: Number, index: -1 },
        },
    ],
    Blacklist: Boolean,
});
module.exports = mongoose.model("cookies", CookieSchema);
