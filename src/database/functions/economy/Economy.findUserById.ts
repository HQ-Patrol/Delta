/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import Economy from "../../models/EconomyModel";

/** *
 * returns an Economy Stats Document by the User Id
 * or creates a new document with default balues
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
 * @usage findByUserId(user.id, false)
 */

async function findByUserId(id: string) {
  let user = await Economy.findById(id);
  if (user === null) {
    user = new Economy({
      id,
    });
  }
  return user;
}

export default findByUserId;
