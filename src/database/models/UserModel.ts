import { Schema, model } from "mongoose";

interface IUser {
  _id: string;
  blacklisted: boolean;
  premium: boolean;
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
  voting: {
    streak: number;
    lastVoted: Date;
    total: number;
  }
}

const UserSchema = new Schema<IUser>({
  _id: { type: String },
  blacklisted: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  bonk: {
    bonkedBy: [String],
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
  voting: {
    streak: Number,
    lastVoted: Date,
    total: Number,
  },
});

const User = model<IUser>("User", UserSchema);
export default User;
