import { Schema, model } from "mongoose";

export interface IRole {
  id: string;
  fight: Array<unknown>;
  snap: Array<unknown>;
  crucify: Array<unknown>;
  rr: Array<unknown>;
  fart: Array<unknown>;
  tts: Array<unknown>;
}

const RoleSchema = new Schema<IRole>({
  id: String,
  fight: Array<unknown>,
  snap: Array<unknown>,
  crucify: Array<unknown>,
  rr: Array<unknown>,
  fart: Array<unknown>,
  tts: Array<unknown>,
});

export const RoleModel = model<IRole>("roles", RoleSchema);
