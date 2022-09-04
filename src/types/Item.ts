export enum ItemType {
    Badge = "BADGE",
    Collectible = "COLLECTIBLE",
    Pets = "PETS",
    Rob = "ROB",
    Special = "SPECIAL",
    Usable = "USABLE",
}

export interface IItemData {
    canBeSold: boolean;
    canBeBought: boolean;
    canBeTraded: boolean;
    canBeUsed: boolean;
}

export interface IItem {
    name: string;
    name2: string;
    alias: string;
    icon: string;
    price: number;
    stock?: number;
    collateralPrice: number;
    description: string;
    usage: string;
    type: ItemType;
    data: IItemData;
}

export interface IUserItem {
    name: string;
    count: number;
    icon: string;
    type: string;
    data: IItemData;
}