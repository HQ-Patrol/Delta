/* eslint-disable new-cap */
import { FilterQuery, Model } from "mongoose";

type IsNew<T> = T & { new: boolean };

export default async <T extends object>(query: FilterQuery<T>, createObject: IsNew<T>, model: Model<T>, lean = true) => {
  let find;
  if (lean) find = await model.findOne(query).lean();
  else find = await model.findOne(query);

  if (!find) {
    await new model(createObject).save();

    // mark created object as a new one
    createObject.new = true;
    return createObject;
  }

  return find;
};
