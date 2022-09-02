import { model, Schema } from "mongoose"

export interface IMinigameData {
    //User Id
    _id: string,

    fight: {
    total: number,
    success: number,
    fails: number,
    wl: number,
    },

    coinflip: {
        total: number,
        wins: number,
        losses: number,
        wl: number
    }
}

const MinigameDataSchema = new Schema<IMinigameData>(
    {
        //User Id
        _id: String,

        fight: {
        total: Number,
        success: Number,
        fails: Number,
        wl: Number,
        },
    
        coinflip: {
            total: Number,
            wins: Number,
            losses: Number,
            wl: Number
        }
    }
);

export const MinigameData = model<IMinigameData>("MinigameData", MinigameDataSchema);