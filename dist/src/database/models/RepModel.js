"use strict";
const mongoose = require("mongoose");
const REPSchema = new mongoose.Schema({
    userID: String,
    username: String,
    repper: Array,
    Derepper: Array,
    rep: Number,
    repW: Number,
});
module.exports = mongoose.model("REP", REPSchema);
