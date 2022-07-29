const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  id: String, // Owner

  // Pet
  species: { type: String, required: true },
  UID: { type: Number, required: true }, // UUID
  name: { type: String, required: true }, // Name (Nickname)
  sprite: { type: String, required: true }, // Emoji
  level: { type: Number, default: 1 }, // Level
  experience: { type: Number, default: 0 },
  statPoints: { type: Number, default: 0 },
  evolution: { type: Number, default: 1 },
  current: { type: Boolean, default: false }, // selected pet
  favorite: { type: Boolean, default: false }, // fav,
  brawlMaster: { type: Boolean, default: false },
  attributes: {
    // Attack, Intelligence, Speed, <- Used in Fights
    // Energy, Hunger, Love <- Used for "Fun"
    attack: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    energy: { type: Number, default: 100 },
    hunger: { type: Number, default: 100 },
    love: { type: Number, default: 50 },
  },
  interactive: {
    // Interactive stuff, makes pets way more fun.
    asleep: { type: Boolean, default: false },
    asleepHours: { type: Number, default: 0 },
  },
  petType: {
    type: String,
    enum: ["REGULAR", "SHADOW"],
    required: true,
  },
  fightsWon: { type: Number, default: 0 },
  // States
  states: {
    play: { type: Date, default: null },
    pat: { type: Date, default: null },
    hug: { type: Date, default: null },

    train: { type: Date, default: null },
  },
  activeSkillCooldowns: { type: Array, default: [] },
});

module.exports = mongoose.model("pets", PetSchema);
