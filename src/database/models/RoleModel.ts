import { Schema, model } from "mongoose";

export interface IRole {
  id: string;
  fight: any[];
  snap: any[];
  crucify: any[];
  rr: any[];
  fart: any[];
  tts: any[];
}

const RoleSchema = new Schema<IRole>({
  id: String,
  fight: Array,
  snap: Array,
  crucify: Array,
  rr: Array,
  fart: Array,
  tts: Array,
});

export const RoleModel = model<IRole>("roles", RoleSchema);
