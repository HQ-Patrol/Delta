"use strict";
const mongoose = require("mongoose");
const PastaSchema = new mongoose.Schema({
    User: {
        id: String,
        name: String,
    },
    Guild: {
        id: String,
        name: String,
    },
    Word: String,
    Pasta: String,
    Time: String,
});
module.exports = mongoose.model("Pasta", PastaSchema, "pasta");
