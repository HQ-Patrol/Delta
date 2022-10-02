import { Schema, model, Types } from "mongoose";

export interface IPetAttributes {
  attack: number;
  intelligence: number;
  speed: number;
  energy: number;
  hunger: number;
  love: number;
}

export interface IPetStates {
  play: Date;
  pat: Date;
  hug: Date;
  train: Date;
}
export interface IPet {
  _id: Types.ObjectId,
  id: string;
  species: string;
  UID: number;
  name: string;
  sprite: string;
  level: number;
  experience: number;
  statPoints: number;
  evolution: number;
  current: boolean;
  favorite: boolean;
  brawlMaster: boolean;
  attributes: IPetAttributes;
  interactive: {
    asleep: boolean;
    asleepHours: number;
  };
  petType: "REGULAR" | "SHADOW";
  fightsWon: number;
  states: IPetStates,
  activeSkillCooldowns: Array<unknown>;
}

const PetSchema = new Schema<IPet>({
  id: {
    type: String,
    ref: "User",
  }, // Owner

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
  activeSkillCooldowns: { type: Array<unknown>, default: [] },
});

export const PetModel = model<IPet>("pets", PetSchema);
