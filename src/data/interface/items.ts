export interface idata {
    canBeSold: boolean;
    canBeBought: boolean;
    canBeTraded: boolean;
}

// eslint-disable-next-line no-shadow
export enum type {
    Badge = "BADGE",
    Collectible = "COLLECTIBLE",
    Pets = "PETS",
    Rob = "ROB",
    Special = "SPECIAL",
    Usable = "USABLE",
}

export default interface items {
    name: string;
    name2: string;
    alias: string;
    icon: string;
    price: number;
    sellPricew: number;
    collateralPrice: number;
    description: string;
    usage: string;
    type: type;
    data: idata;
// eslint-disable-next-line semi
}