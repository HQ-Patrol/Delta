// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function (query: object, createObject: object, Model: any, lean = true) {
  let find;
  if (lean) find = await Model.findOne(query).lean();
  else find = await Model.findOne(query);

  if (!find) {
    await new Model(createObject).save();

    return createObject;
  }

  return find;
}
