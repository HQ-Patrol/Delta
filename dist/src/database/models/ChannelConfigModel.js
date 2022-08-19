"use strict";
const mongoose = require("mongoose");
const ChannelSchema = new mongoose.Schema({
    _id: String,
    report: String,
    confessions: String,
    mod: String,
    simp: String,
});
module.exports = mongoose.model("channel", ChannelSchema);
