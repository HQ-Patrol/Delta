"use strict";
const Mongoose = require("mongoose");
const daily = new Mongoose.Schema({
    id: String,
    vote: {
        days: { type: Number, default: 0 },
        last: { type: Number, default: 0 },
    },
    nextWeekly: { type: Number, default: -1 },
});
module.exports = Mongoose.model("cooldowns", daily);
