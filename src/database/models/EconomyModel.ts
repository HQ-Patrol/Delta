import { IUserItem } from "./../../types/Item";
import { Schema, model } from "mongoose";
export interface IEconomy {
  id: string;
  lastUse: Schema.Types.Date;
  coins: number;
  bank: number;
  xp: number;
  level: number;
  items: Array<IUserItem>;
  bracket: number;
  minigames: {
    fight: {
      enabled: boolean,
      total: number,
      wins: number,
      losses: number,
      wl: number,
    },
    coinflip: {
      total: number,
      wins: number,
      losses: number,
      wl: number
    }
  }
}

const EconomySchema = new Schema({
  id: { 
    type: String, 
    ref: "User",  
  },
  lastUse: { 
    type: Schema.Types.Date, 
    default: Date.now() 
  },
  coins: { 
    type: Number,
    default: 50
  },
  bank: { 
    type: Number,  
    default: 0 
  },
  xp: { 
    type: Number, 
    default: 0 
  },
  level: { 
    type: Number, 
    default: 1
  },
  items: { 
    type: Array, 
    default: [] 
  },
  bracket: { 
    type: Number, 
    default: 1
  },
  minigames: {
    fight: {
      enabled: {
        type: Boolean,
        default: false
      },
      total: {
          type: Number,
          default: 0
      },
      wins: {
          type: Number,
          default: 0
      },
      losses: {
          type: Number,
          default: 0
      },
      wl: {
          type: Number,
          default: 0
      }
  },
  coinflip: {
      total: {
          type: Number,
          deault: 0
      },
      wins: {
          type: Number,
          default: 0
      },
      losses: {
          type: Number,
          default: 0
      },
      wl: {
          type: Number,
          default: 0
      }
    }
  }
});

export const Economy = model<IEconomy>("stats", EconomySchema);
