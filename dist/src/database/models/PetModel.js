"use strict";
const mongoose = require("mongoose");
const PetSchema = new mongoose.Schema({
    id: {
        type: String,
        ref: "User"
    },
    species: { type: String, required: true },
    UID: { type: Number, required: true },
    name: { type: String, required: true },
    sprite: { type: String, required: true },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    statPoints: { type: Number, default: 0 },
    evolution: { type: Number, default: 1 },
    current: { type: Boolean, default: false },
    favorite: { type: Boolean, default: false },
    brawlMaster: { type: Boolean, default: false },
    attributes: {
        attack: { type: Number, default: 0 },
        intelligence: { type: Number, default: 0 },
        speed: { type: Number, default: 0 },
        energy: { type: Number, default: 100 },
        hunger: { type: Number, default: 100 },
        love: { type: Number, default: 50 },
    },
    interactive: {
        asleep: { type: Boolean, default: false },
        asleepHours: { type: Number, default: 0 },
    },
    petType: {
        type: String,
        enum: ["REGULAR", "SHADOW"],
        required: true,
    },
    fightsWon: { type: Number, default: 0 },
    states: {
        play: { type: Date, default: null },
        pat: { type: Date, default: null },
        hug: { type: Date, default: null },
        train: { type: Date, default: null },
    },
    activeSkillCooldowns: { type: Array, default: [] },
});
module.exports = mongoose.model("pets", PetSchema);
