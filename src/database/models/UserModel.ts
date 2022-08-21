import { Schema, model } from "mongoose";

export interface IUser {
  _id: string;
  blacklisted: boolean;
  premium: boolean;
  bonk: {
    bonkedBy: Array<string>;
    lastBonk: number;
  };
  Biggercooldown: Array<object>;
  verified: boolean;
  certified: boolean;
  DMs: boolean;
  premLeft: string;
  hatched: {
    SHADOW: boolean;
    DOG: boolean;
    DUCK: boolean;
    MONKEY: boolean;
    LION: boolean;
    GARGOYLE: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  _id: { type: String },
  blacklisted: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  bonk: {
    bonkedBy: Array<string>,
    lastBonk: Number,
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

export const UserModel = model<IUser>("User", UserSchema);
