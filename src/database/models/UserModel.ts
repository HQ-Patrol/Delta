import { Schema, model } from "mongoose";

export interface IUser {
  id: string;
  blacklisted: boolean;
  premium: boolean;
  muted: boolean;
  bonk: {
    bonkedBy: string[];
    lastBonk: number;
  }
  Biggercooldown: [ {
    command: string;
    endCooldown: number;
  }]
  DMs: boolean;
  verified: boolean;
  certified: boolean;
  premLeft: string;
  hatched: {
    SHADOW: boolean;
    DOG: boolean;
    DUCK: boolean;
    MONKEY: boolean;
    LION: boolean;
    GARGOYLE: boolean;
  }
  
}

const UserSchema = new Schema<IUser>({
  id: { type: String },
  blacklisted: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  bonk: {
    bonkedBy: { 
      type: Array,
      default: []
    },
    lastBonk: {
      type: Number,
      default: 0
    },
  },
  Biggercooldown: [
    {
      command: String,
      endCooldown: Number,
    },
  ],
  verified: { type: Boolean, default: false, index: true },
  certified: { type: Boolean, default: false, index: true },
  DMs: { type: Boolean, default: true },
  premLeft: String,
  hatched: {
    SHADOW: Boolean,
    DOG: Boolean,
    DUCK: Boolean,
    MONKEY: Boolean,
    LION: Boolean,
    GARGOYLE: Boolean,
  },
  
});

export const User = model<IUser>("User", UserSchema);

