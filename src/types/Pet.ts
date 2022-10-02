export enum PetSpecies {
	Dog = "DOG",
	Duck = "DUCK",
	Monkey = "MONKEY", 
	Lion = "LION",
	Gargoyle = "GARGOYLE",
	Dragon = "DRAGON"
}

export enum PetRarity {
	Common = "COMMON",
	Uncommon = "UNCOMMON",
	Rare = "RARE",
	Epic = "EPIC",
	Legendary = "LEGENDARY",
}

export interface IPetResolved {
	"name": string,
	"sprite": string,
	"UID": number,
	"id": number,
	"species": PetSpecies,
	"rarity": PetRarity,
	"shadowSprite": string,
	"fours": string[]
	"shadowFours": string[]
	"reversedFours": string[];
	"shadowReversedFours": string[]
}