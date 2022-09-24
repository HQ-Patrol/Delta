import { Schema, model } from "mongoose";

export interface IEvent {
  X1: number;
  X2: number;
  X3: number;
  X4: number;
}

const EventSchema = new Schema<IEvent>({
  X1: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  X2: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  X3: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  X4: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
});

export const EventModel = model<IEvent>("event", EventSchema);
