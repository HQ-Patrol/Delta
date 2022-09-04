
import { Economy } from "../../models/EconomyModel";

/** *
 * returns an Economy Document by the User ID
 * or creates a new document with default values
 * if one does not already exists.
 *
 * @async
 * @function
 *
 *
 * @author Samuel "TheMorrigan" Echols
 *
 * @param {String} id -  id of the desired user.
 * @return {<<Query>>} Document
 * @usage findByUserId(user.id)
 */

async function findByUserId(id: string) {
  let user = await Economy.findOne({ id });
    user = await new Economy({
      id: id
    }).save();
  return user;
}

export default findByUserId;