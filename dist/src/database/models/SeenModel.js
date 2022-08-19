"use strict";
const mongoose = require("mongoose");
const SeenSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    lastSeens: [
        {
            date: {
                type: Date,
                index: true,
            },
            guildId: String,
        },
    ],
});
module.exports = mongoose.model("Seen", SeenSchema);
