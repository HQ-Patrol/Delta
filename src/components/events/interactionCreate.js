const { Interaction } = require("discord.js");

module.exports = {
  event: "interactionCreate",
  async handle(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command || !command.slash) return;

    command.slash.handler(client, interaction);
  },
};
