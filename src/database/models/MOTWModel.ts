import { Schema, model } from "mongoose";

export interface IMotw {
  userID: string,
  servers: Array<object>,
  modV: number,
  motw: number,
}

const MOTWSchema = new Schema<IMotw>({
  userID: String,
  servers: [
    {
      serverID: String,
      MVs: { type: Number, index: -1 },
      MOTWs: { type: Number, index: -1 },
    },
  ],
  modV: { type: Number, index: -1 },
  motw: { type: Number, index: -1 },
});

export const MOTWModel = model<IMotw>("MOTW", MOTWSchema);
