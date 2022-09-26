import { Schema, model } from "mongoose";

export interface ICookie {
  userID: string,
  cookies: number,
  totalgiven: number,
  given: Array<object>,
  Blacklist: boolean
}

const CookieSchema = new Schema<ICookie>({
  userID: String,
  cookies: { type: Number, index: -1 },
  totalgiven: Number,
  given: [
    {
      userID: String,
      count: { type: Number, index: -1 },
    },
  ],
  Blacklist: Boolean,
});

export const CookieModel = model<ICookie>("cookies", CookieSchema);
