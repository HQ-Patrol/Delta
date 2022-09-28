import { IPet, PetModel } from "../../database/models/PetModel";
import { pets } from "../../data/json/pets.json";
import { IPetResolved, PetRarity } from "../../types/Pet";
import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from "discord.js";

export function resolvePet(name: string) {
  return pets.find(
    (pet) => pet.name.toLowerCase() === name.toLowerCase()
  ) as IPetResolved;
}

export function getColorByRarity(rarity: PetRarity | undefined) {
  if (!rarity) return "GRAY";
  return {
    COMMON: "#FF7F00",
    UNCOMMON: "#0000FF",
    RARE: "#FF0000",
    EPIC: "#00FF00",
    LEGENDARY: "#FFD700",
  }[rarity];
}

export async function getSelectedPet(id: string) {
  const pet = (await PetModel.findOne({ id, current: true }).lean()) || null;
  return pet;
}

export function rndNumber(a: number, b: number) {
  return Math.trunc(Math.random() * (b - a) + a);
}

export function randomFromArray(array: unknown[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function disableAllButtons(componentRow: MessageActionRow) {
  return componentRow?.components.forEach((e) => e.setDisabled(true));
}

export async function changePetName(
  interaction: CommandInteraction | ButtonInteraction,
  pet: IPet
) {
  const modal = new Modal()
    .setCustomId(`petname|new|${pet._id}`)
    .setTitle("Set your pets name!")
    .addComponents(
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        new TextInputComponent()
          .setCustomId("nameComponent")
          .setLabel(`What would you like to name ${pet.name}?`)
          .setStyle("SHORT")
          .setMinLength(1)
          .setMaxLength(20)
      )
    );
  await interaction.showModal(modal);
  // Rest will be handled in a listener
}
