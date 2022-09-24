import { Schema, model } from "mongoose";

export interface IHalloween {
  id: string;
  candy: {
    chocolate: number;
    caramel: number;
    wonkabar: number;
    bonbon: number;
    candybutton: number;
    candycane: number;
    marshmallow: number;
    bubblegum: number;
    gumball: number;
    gummybear: number;
    jellybean: number;
    jawbreaker: number;
    jollyrancher: number;
    lollipop: number;
    mintcandy: number;
    pocky: number;
    skittle: number;
    sourpatch: number;
    candystick: number;
    toffee: number;
    soulstone: number;
    mindstone: number;
    timestone: number;
    realitystone: number;
    powerstone: number;
    spacestone: number;
  };
  CandyCount: number;
  Snap: number;
  Package: number;
  Luck: number;
  shield: number;
  booster: number;
  boosterResetDate: number;
  cooldown: {
    cdaily: number;
  };
}

const HalloweenSchema = new Schema<IHalloween>({
  id: String,
  candy: {
    chocolate: { type: Number, default: 0 },
    caramel: { type: Number, default: 0 },
    wonkabar: { type: Number, default: 0 },
    bonbon: { type: Number, default: 0 },
    candybutton: { type: Number, default: 0 },
    candycane: { type: Number, default: 0 },
    marshmallow: { type: Number, default: 0 },
    bubblegum: { type: Number, default: 0 },
    gumball: { type: Number, default: 0 },
    gummybear: { type: Number, default: 0 },
    jellybean: { type: Number, default: 0 },
    jawbreaker: { type: Number, default: 0 },
    jollyrancher: { type: Number, default: 0 },
    lollipop: { type: Number, default: 0 },
    mintcandy: { type: Number, default: 0 },
    pocky: { type: Number, default: 0 },
    skittle: { type: Number, default: 0 },
    sourpatch: { type: Number, default: 0 },
    candystick: { type: Number, default: 0 },
    toffee: { type: Number, default: 0 },
    soulstone: { type: Number, default: 0 },
    mindstone: { type: Number, default: 0 },
    timestone: { type: Number, default: 0 },
    realitystone: { type: Number, default: 0 },
    powerstone: { type: Number, default: 0 },
    spacestone: { type: Number, default: 0 },
  },
  CandyCount: { type: Number, default: 0 },
  Snap: { type: Number, default: 0 },
  Package: { type: Number, default: 0 },
  Luck: {
    type: Number,
    default: 50,
  },
  shield: {
    type: Number,
    default: 0,
  },
  booster: {
    type: Number,
    default: 0,
  },
  boosterResetDate: {
    type: Number,
    default: 0,
  },
  cooldown: {
    cdaily: { type: Number, default: 0 },
  },
});

export const HalloweenModel = model<IHalloween>("halloween", HalloweenSchema);
