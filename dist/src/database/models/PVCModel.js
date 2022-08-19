"use strict";
const mongoose = require("mongoose");
const PVCSchema = new mongoose.Schema({
    id: String,
    bosses: [
        {
            completed: Boolean,
            bossID: String,
            cooldown: Number,
            win: { type: Number, default: 0 },
            loss: { type: Number, default: 0 },
        },
    ],
});
module.exports = mongoose.model("pvc", PVCSchema);
