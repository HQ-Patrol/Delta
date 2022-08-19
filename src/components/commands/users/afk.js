const Discord = require("discord.js");

// eslint-disable-next-line prefer-regex-literals
const URL_REGEX = new RegExp(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/g);

const AFKModel = require("../../../database/models/AFKModel");
const findOneOrCreate = require("../../../database/functions/findOneOrCreate");

module.exports = {
  name: "afk",
};

module.exports.slash = {
  data: new Discord.SlashCommandBuilder()
    .setName("afk")
    .setDescription("Notify other users that you are AFK")
    .addStringOption((option) => option
      .setName("reason")
      .setDescription("Why are you going AFK?")
      .setRequired(false)),
  async handler(client, interaction) {
    const data = await findOneOrCreate({ _id: interaction.guild.id }, { _id: interaction.guild.id, afkMembers: [] }, AFKModel);
    console.log(data);
    // Check if user is already AFK
    const index = data.afkMembers.findIndex((user) => user.id === interaction.user.id);
    if (index !== -1) {
      // User is already afk, remove AFK
      await AFKModel.updateOne({ _id: interaction.guild.id }, { $pull: { afkMembers: { id: interaction.user.id } } });
      if (interaction.member.displayName.startsWith("[AFK] ")) {
        interaction.member
          .setNickname(interaction.member.displayName.replace("[AFK] ", ""), "Came back from AFK")
          .catch(() => {});
      }
      return interaction.reply({ content: `${client.e.exclamation} You were already AFK, so I have removed your AFK.\n\`Want to set your AFK status again? Reuse the command!\``, ephemeral: true });
    }

    const reason = interaction.options.getString("reason") || "No Reason Provided";
    // Check if message contains URL
    if (interaction.userData?.premium === false && URL_REGEX.test(reason)) {
      return interaction.reply({ content: `${client.e.exclamation} Links are only allowed for **Patrol Bot Premium** Users!`, ephemeral: true });
    }

    await AFKModel.updateOne(
      { _id: interaction.guild.id },
      { $push: { afkMembers: { id: interaction.user.id, reason } } },
    );

    interaction.member
      .setNickname(`[AFK] ${interaction.member.displayName}`, `AFK Command - ${reason}`)
      .catch(() => {});

    return interaction.reply(`${client.e.tick} You are now AFK!\nReason: \`${reason}\``);
  },
};
