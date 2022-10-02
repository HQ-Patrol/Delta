import { model, Schema } from "mongoose";

export interface IWork {
    id: string,
    artist: number,
    internetTroll: number,
    discordModerator: number,
    plumber: number,
    chef: number,
    techSupport: number,
    goldDigger: number,
    teacher: number,
    rapper: number,
    hacker: number,
    influencer: number,
    stripper: number,
}

const WorkSchema = new Schema<IWork>({
    id: String,
    artist: Number,
    internetTroll: Number,
    discordModerator: Number,
    plumber: Number,
    chef: Number,
    techSupport: Number,
    goldDigger: Number,
    teacher: Number,
    rapper: Number,
    hacker: Number,
    influencer: Number,
    stripper: Number,
})

export const WorkModel = model<IWork>("Work", WorkSchema);