import { Schema, model } from "mongoose";

export interface IPasta {
  user: {
    id: string;
    name: string;
  };
  guild: {
    id: string;
    name: string;
  };
  word: string;
  pasta: string;
  time: string;
}

const PastaSchema = new Schema<IPasta>({
  user: {
    id: String,
    name: String,
  },
  guild: {
    id: String,
    name: String,
  },
  word: String,
  pasta: String,
  time: String,
});

export const PastaModel = model<IPasta>("Pasta", PastaSchema);
