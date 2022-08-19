// /**
//  * Calculates the maximum bank compacity of a user
//  * @param {Object} user user model
//  * @returns {number}
//  */
// const getMaximumCompacity = (user) => {
//   let capacity = 0;
//   for (let i = 1; i <= 100; i += 1) {
//     if (i > user.level) break;
//     if (i <= 10) capacity += 10000;
//     if (i > 10 && i <= 20) capacity += 40000;
//     if (i > 20 && i <= 30) capacity += 50000;
//     if (i > 30 && i <= 40) capacity += 150000;
//     if (i > 40 && i <= 60) capacity += 250000;
//     if (i > 60 && i <= 80) capacity += 375000;
//     if (i > 80 && i <= 90) capacity += 500000;
//     if (i > 90) capacity += 1000000 * (i - 90);
//   }

//   // Tax bracket
//   switch (user.bracket) {
//   case 2:
//     capacity += 1000000;
//     break;
//   case 3:
//     capacity += 2500000;
//     break;
//   case 4:
//     capacity += 5000000;
//     break;
//   case 5:
//     capacity += 10000000;
//     break;
//   default:
//     break;
//   }

//   return capacity;
// };

// /**
//  * Expands a string in abbreviated form e.g ending with k
//  * Don't use this directly! Use parseInt instead
//  * @param {string} string number in abbreviated form
//  * @returns {number}
//  */
// function expandNumber(string) {
//   const d = {
//     h: 100,
//     k: 1000,
//     m: 1000000,
//   };

//   if (Object.keys(d).includes(string.at(-1))) {
//     return parseInt(string.slice(0, string.length - 1), 10) * d[string.at(-1)];
//   }

//   return parseInt(string, 10);
// }

// /**
//  * Parses a string into a number, but with different filters.
//  * @param {string} string
//  * @param {number} all
//  * @param {string} argument
//  * @returns {number}
//  */
// function parse(string, all, argument) {
//   // Parse arguments
//   if (argument === "all" || argument === "max") {
//     return all;
//   } if (argument === "half") {
//     return Math.floor(all / 2);
//   }

//   // Expand
//   const num = expandNumber(string);
//   if (Number.isNaN(num)) return -1;

//   return num;
// }

// module.exports = {
//   getMaximumCompacity,
//   parse,
// };
