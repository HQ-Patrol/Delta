const { REST } = require("@discordjs/rest");
const {
  SlashCommandBuilder,
  PermissionsBitField,
  Routes,
  SlashCommandBooleanOption,
} = require("discord.js");

const SlashCommand = new SlashCommandBuilder()
  .setName("updateslash")
  .setDescription("Update slash commands.")
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ADMINISTRATOR)
  .setDMPermission(false)
  .addBooleanOption((option) => option
    .setName("global")
    .setDescription("Update all available commands globally?")
    .setRequired(false));

const rest = new REST({ version: "10" });
let tokenSet = false;

module.exports = {
  slash: {
    data: SlashCommand,
    async handler(client, interaction) {
      if (!tokenSet) {
        rest.setToken(client.token);
        tokenSet = true;
      }

      await interaction.deferReply({ ephemeral: true });

      const commands = [];
      for (const cmd of client.commands) {
        if (!cmd.slash?.data) continue;
        commands.push(cmd.slash.data.toJSON());
      }

      const global = interaction.options.getBoolean("global");
      const route = global ? Routes.applicationCommands(client.application.id) : Routes.applicationGuildCommands(client.application.id, interaction.guildId);

      try {
        await rest.put(route, { body: commands });
        await interaction.editReply({ content: "Success!" });
      } catch (e) {
        await interaction.editReply({ content: e.toString() });
      }
    },
  },
  name: "updateslash",
  description: "",
  usage: "",
  category: "admin",
  cooldown: 1,
  async run(client, message, _args) {
    if (!tokenSet) {
      rest.setToken(client.token);
      tokenSet = true;
    }
    try {
      await rest.put(
        Routes.applicationCommands(client.application.id),
        { body: [this.slash.data] },
      );
      message.reply("Success!");
    } catch (e) {
      console.error(e);
      message.reply("Error!");
    }
  },
};
