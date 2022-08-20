import EconomyModel from "../models/EconomyModel";

export default async function (query: object, createObject: { new: boolean; }, Model: typeof EconomyModel, lean = true) {
  let find;
  if (lean) find = await Model.findOne(query).lean();
  else find = await Model.findOne(query);

  if (!find) {
    await new Model(createObject).save();

    // mark created object as a new one
    createObject.new = true;

    return createObject;
  }

  return find;
}
