import { Schema, model } from "mongoose";

export interface IGamblingCard {
  id: string;
  cf: {
    total: number;
    wins: number;
    winnings: number;
    loss: number;
    losses: number;
    bets: number;
  };
  rt: {
    total: number;
    wins: number;
    winnings: number;
    loss: number;
    losses: number;
    bets: number;
  };
  dr: {
    total: number;
    wins: number;
    winnings: number;
    loss: number;
    losses: number;
    bets: number;
  };
  bj: {
    total: number;
    wins: number;
    winnings: number;
    loss: number;
    losses: number;
    bets: number;
  };
  slots: {
    total: number;
    wins: number;
    winnings: number;
    loss: number;
    losses: number;
    bets: number;
  };
}

const GamblingCardSchema = new Schema<IGamblingCard>({
  id: String,
  cf: {
    total: Number,
    wins: Number,
    winnings: Number,
    loss: Number,
    losses: Number,
    bets: Number,
  },
  rt: {
    total: Number,
    wins: Number,
    winnings: Number,
    loss: Number,
    losses: Number,
    bets: Number,
  },
  dr: {
    total: Number,
    wins: Number,
    winnings: Number,
    loss: Number,
    losses: Number,
    bets: Number,
  },
  bj: {
    total: Number,
    wins: Number,
    winnings: Number,
    loss: Number,
    losses: Number,
    bets: Number,
  },
  slots: {
    total: Number,
    wins: Number,
    winnings: Number,
    loss: Number,
    losses: Number,
    bets: Number,
  },
});

export const GamblingCardModel = model<IGamblingCard>(
  "gamblingCard",
  GamblingCardSchema
);
