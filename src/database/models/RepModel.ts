import { Schema, model } from "mongoose";

export interface IRep {
  userID: string;
  username: string;
  repper: Array<unknown>;
  Derepper: Array<unknown>;
  rep: number;
  repW: number;
}

const RepSchema = new Schema<IRep>({
  userID: String,
  username: String,
  repper: Array<unknown>,
  Derepper: Array<unknown>,
  rep: Number,
  repW: Number,
});

export const RepModel = model<IRep>("REP", RepSchema);
