import { PetModel } from "../../database/models/PetModel";

export async function getSelectedPet(id: string) {
  const pet = (await PetModel.findOne({ id, current: true }).lean()) || null;
  return pet;
}

export function rndNumber(a: number, b: number) {
  return Math.trunc(Math.random() * (b - a) + a);
}

export function randomFromArray(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function disableAllButtons(componentRow: any) {
  return componentRow?.components.forEach((e: any) => e.setDisabled(true));
}
