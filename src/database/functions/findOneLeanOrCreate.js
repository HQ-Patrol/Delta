module.exports = async (query, createObject, Model, lean = true) => {
  let find = null;
  if (lean) find = await Model.findOne(query).lean();
  else find = await Model.findOne(query);

  if (!find || find === null) {
    await new Model(createObject).save();
    return createObject;
  }
  return find;
};
