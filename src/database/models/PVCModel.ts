import { Schema, model } from "mongoose";

export interface IPVC {
  id: string;
  bosses: Array<object>;
}

const PVCSchema = new Schema<IPVC>({
  id: String,
  bosses: [
    {
      completed: Boolean,
      bossID: String,
      cooldown: Number,
      win: { type: Number, default: 0 },
      loss: { type: Number, default: 0 },
    },
  ],
});

export const PVCModel = model<IPVC>("pvc", PVCSchema);
