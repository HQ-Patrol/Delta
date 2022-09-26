import { Schema, model } from "mongoose";

export interface IItemUse {
  id: string;
  protects: number;
  handcuffs: string;
  snitch: boolean;
  snitchDemon: boolean;
  rugTime: number;
  handcuffsTime: number;
  wSkip: number;
  mSkip: number;
}

const ItemUseSchema = new Schema<IItemUse>({
  id: String,
  protects: { type: Number, default: 0 },
  handcuffs: { type: String, default: null },
  snitch: { type: Boolean, default: false },
  snitchDemon: { type: Boolean, default: false },
  rugTime: { type: Number, default: Date.now() },
  handcuffsTime: { type: Number, default: Date.now() },
  wSkip: Number,
  mSkip: Number,
});

export const ItemUseModel = model<IItemUse>("itemUse", ItemUseSchema);
