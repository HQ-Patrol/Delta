// const UserModel = require("../../models/UserModel");

// /** *
//  * returns an Economy Stats Document by the User Id
//  * or creates a new document with default balues
//  * if one does not already exists.
//  *
//  * @async
//  * @function
//  *
//  *
//  * @author Samuel "TheMorrigan" Echols
//  *
//  * @param {String} id -  id of the desired user.
//  * @param {boolean} create - [default value is true] if this is true, then a new document will be created
//  * @return {<<Query>>} Document
//  * @usage findByUserId(user.id)
//  * @usage findByUserId(user.id, false)
//  */

// async function findByUserId(id, create = true) {
//   let user;
//   if (!create) {
//     user = await UserModel.findById(id);
//   } else {
//     user = await UserModel.findOneAndUpdate(
//       // Query
//       id,
//       // Update
//       // Sets the id field to the users id provided by the <id> parameter
//       {
//         $setOnInsert: {
//           id: user.id,
//         },
//       },
//       // Options
//       {
//         // If no document is found, one will be inserted
//         upsert: true,
//         setDefaultsOnInsert: true,
//       },
//     );
//   }
//   return user;
// }

// module.exports = findByUserId();
