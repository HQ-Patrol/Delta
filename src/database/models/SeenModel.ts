import { Schema, model } from "mongoose";

export interface ISeen {
  _id: string;
  lastSeens: Array<object>;
}

const SeenSchema = new Schema<ISeen>({
  _id: {
    type: String,
  },
  lastSeens: [
    {
      date: {
        type: Date,
        index: true,
      },
      guildId: String,
    },
  ],
});

export const SeenModel = model<ISeen>("Seen", SeenSchema);
