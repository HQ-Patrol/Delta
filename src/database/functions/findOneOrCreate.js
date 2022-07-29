module.exports = async (query, createObject, Model, lean = true) => {
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
};
