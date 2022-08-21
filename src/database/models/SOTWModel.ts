import { Schema, model } from "mongoose";

export interface ISotw {
  userID: string;
  servers: [
    {
      serverID: string;
      SVs: number;
      SOTWs: number;
    }
  ];
  simpV: number;
  sotw: number;
}

const SOTWSchema = new Schema<ISotw>({
  userID: String,
  servers: [
    {
      serverID: String,
      SVs: { type: Number, index: -1 },
      SOTWs: { type: Number, index: -1 },
    },
  ],
  simpV: { type: Number, index: -1 },
  sotw: { type: Number, index: -1 },
});

export const SOTWModel = model<ISotw>("SOTW", SOTWSchema);
