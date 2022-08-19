// const $ = require("chalk");

// const findOneOrCreate = require("../../database/functions/findOneOrCreate");
// const { log, error } = require("../../utilities/logger");

// const User = require("../../database/models/UserModel");

// module.exports = {
//   event: "interactionCreate",
//   async handle(client, interaction) {
//     if (!interaction.isChatInputCommand()) return;

//     const command = client.commands.get(interaction.commandName);
//     if (!command || !command.slash) return;

//     try {
//       // User Data
//       const userData = await findOneOrCreate(
//         { _id: interaction.user.id },
//         { _id: interaction.user.id, premium: false, blacklisted: false },
//         User,
//       );

//       if (userData.blacklisted && userData.blacklisted === true) return;

//       interaction.userData = userData;

//       command.slash.handler(client, interaction);
//       log("SLASH", `${$.bold(interaction.user.tag)} [${interaction.user.id}] used ${$.bold(interaction.commandName)} in ${interaction.guild.name} [${interaction.guild.id}]`, "white", client.cluster.id);

//       // TODO: Implement MB1, MB2, XP-COIN Addition
//     } catch (err) {
//       error(`An error occured while running the ${$.bold(command)} command:`, "slash");

//       console.error(err);
//     }
//   },
// };
