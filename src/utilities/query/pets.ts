import { PetModel } from "../../database/models/PetModel";

export async function getSelectedPet(id: string) {
	const pet = await PetModel.findOne({ id, current: true }).lean() || null;
	return pet;
}