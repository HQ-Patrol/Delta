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
}

export default interface IItem {
    name: string;
    name2: string;
    alias: string;
    icon: string;
    price: number;
    sellPricew: number;
    collateralPrice: number;
    description: string;
    usage: string;
    type: ItemType;
    data: IItemData;
}