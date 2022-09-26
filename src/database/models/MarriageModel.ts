import { Schema, model } from "mongoose";

export interface IMarriage {
  id: string;
  spouse: string;
  time: string;
  total: number;
  spouses: [];
  prenup: boolean;
  bloodPact: boolean;
}

const MarriageSchema = new Schema<IMarriage>({
  id: String,
  spouse: String,
  time: String,
  total: Number,
  spouses: Array,
  prenup: Boolean,
  bloodPact: Boolean,
});

export const MarriageModel = model<IMarriage>("marriage", MarriageSchema);
