"use strict";
const mongoose = require("mongoose");
const CustomRoleSchema = new mongoose.Schema({
    _id: String,
    roles: [
        {
            id: String,
            owner: String,
        },
    ],
});
module.exports = mongoose.model("CustomRole", CustomRoleSchema);
