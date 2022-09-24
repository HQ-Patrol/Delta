import { Schema, model } from "mongoose";

export interface IItemUse {
  id: string;
  protects: number;
  handcuffs: string;
  snitch: boolean;
  snitchDemon: boolean;
  rugTime: string;
  handcuffsTime: string;
  wSkip: number;
  mSkip: number;
}

const ItemUseSchema = new Schema<IItemUse>({
  id: String,
  protects: Number,
  handcuffs: String,
  snitch: Boolean,
  snitchDemon: Boolean,
  rugTime: String,
  handcuffsTime: String,
  wSkip: Number,
  mSkip: Number,
});

export const ItemUseModel = model<IItemUse>("itemUse", ItemUseSchema);
