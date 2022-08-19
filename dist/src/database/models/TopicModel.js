"use strict";
const mongoose = require("mongoose");
const TopicSchema = new mongoose.Schema({
    UserID: String,
    topicNo: Number,
    topic: String,
    count: Number,
});
module.exports = mongoose.model("topic", TopicSchema);
