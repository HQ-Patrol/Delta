import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { PastaModel } from "../../../database/models/PastaModel";
import { MessageEmbed } from "discord.js";
import { User } from "../../../database/models/UserModel";
import config from "../../../config";

@ApplyOptions<Command.Options>({
  name: "notes",
  description: "Shows notes commands.",
})
export class NotesCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
          subcommand
            .setName("view")
            .setDescription("View a saved note.")
            .addStringOption((option) =>
              option
                .setName("word")
                .setDescription("The word to view its saved note.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("create")
            .setDescription("Create a new note.")
            .addStringOption((option) =>
              option
                .setName("word")
                .setDescription("The word to be used to view the note.")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("content")
                .setDescription("The note's content")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("delete")
            .setDescription("Delete a saved note.")
            .addStringOption((option) =>
              option
                .setName("word")
                .setDescription("The word to view its saved note.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("edit")
            .setDescription("Edit a note.")
            .addStringOption((option) =>
              option
                .setName("word")
                .setDescription("The word that's used to view the note.")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("content")
                .setDescription("The new note content.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("info")
            .setDescription("Show the info of any saved note.")
            .addStringOption((option) =>
              option
                .setName("word")
                .setDescription("The word that's used to view the note.")
                .setRequired(true)
            )
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "view") {
      const word = interaction.options.getString("word");

      const res = await PastaModel.findOne({ word });
      if (!res) {
        let embed = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `**NO NOTE EXISTS FOR** \`${word}\` <a:exclamation:741988026296696872>`
          );
        return interaction.reply({ embeds: [embed] });
      } else {
        let embed = new MessageEmbed()
          .setColor("RANDOM")
          .setThumbnail("https://i.imgur.com/pUJKg4b.gif")
          .setTitle(`📝 Notes - ${res.word}`)
          .setDescription(res.pasta)
          .setFooter({
            text: `Requested by: ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          });
        return interaction.reply({ embeds: [embed] });
      }
    } else if (subcommand === "create") {
      const word = interaction.options.getString("word") as string;
      const content = interaction.options.getString("content") as string;

      const user = await User.findOne({ id: interaction.user.id });
      if (content.length > 1024 && !user?.premium)
        return interaction.reply({
          embeds: [
            {
              color: "RED",
              description:
                "Pasta limit can't exceed 1024 words for peasants. Be a Premium member to double the limit <:EricaEvilPlotting:897841584647847986>",
            },
          ],
        });

      if (content.length > 2020)
        return interaction.reply({
          embeds: [
            {
              color: "RED",
              description:
                "Pasta limit can't exceed 2020 words bc of Discord's message size limit <a:exclamation:741988026296696872>",
            },
          ],
        });

      try {
        const res = await PastaModel.findOne({ word });
        if (res) {
          let embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `<a:RedTick:736282199258824774> **|| A pasta for \`${word}\` already exists!**`
            );
          return interaction.reply({ embeds: [embed] });
        } else {
          const newPasta = new PastaModel({
            user: {
              id: interaction.user.id,
              name: interaction.user.username,
            },
            guild: {
              id: interaction.guild?.id,
              name: interaction.guild?.name,
            },
            word,
            pasta: content,
            time: interaction.createdAt.toUTCString(),
          });
          await newPasta.save();

          let embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `<a:GreenTick:736282149094949096> **|| ${interaction.user} created a pasta for \`${word}\` and saved it in the Database!**`
            );
          return interaction.reply({ embeds: [embed] });
        }
      } catch (err) {
        console.error(err);
      }
    } else if (subcommand === "delete") {
      const word = interaction.options.getString("word");

      if (config.babysitters.includes(interaction.user.id)) {
        try {
          const res = await PastaModel.findOneAndDelete({ word });
          if (!res) {
            let embed = new MessageEmbed()
              .setColor("RED")
              .setDescription(
                `<a:RedTick:736282199258824774> **|| A note for \`${word}\` doesn't exist!**`
              );

            return interaction.reply({ embeds: [embed] });
          } else {
            let embed = new MessageEmbed()
              .setColor("GREEN")
              .setDescription(
                `<a:GreenTick:736282149094949096> **|| ${interaction.user} forcefully recycled the note for: \`${word}\` ♻**`
              );
            return interaction.reply({ embeds: [embed] });
          }
        } catch (err) {
          console.error(err);
        }
      }

      try {
        const res = await PastaModel.findOneAndDelete({
          word,
          "user.id": interaction.user.id,
        });
        if (!res) {
          let embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `<a:RedTick:736282199258824774> **|| A note for \`${word}\` doesn't exist or is not owned by you!**`
            );

          return interaction.reply({ embeds: [embed] });
        } else {
          let embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `<a:GreenTick:736282149094949096> **|| ${interaction.user} deleted his pasta for \`${word}\` ♻**`
            );
          return interaction.reply({ embeds: [embed] });
        }
      } catch (err) {
        console.error(err);
      }
    } else if (subcommand === "edit") {
      const word = interaction.options.getString("word") as string;
      const content = interaction.options.getString("content") as string;

      const user = await User.findOne({ id: interaction.user.id });
      if (content.length > 1024 && !user?.premium)
        return interaction.reply({
          embeds: [
            {
              color: "RED",
              description:
                "Pasta limit can't exceed 1024 words for peasants. Be a Premium member to double the limit <:EricaEvilPlotting:897841584647847986>",
            },
          ],
        });

      if (content.length > 2020)
        return interaction.reply({
          embeds: [
            {
              color: "RED",
              description:
                "Pasta limit can't exceed 2020 words bc of Discord's message size limit <a:exclamation:741988026296696872>",
            },
          ],
        });

      if (config.babysitters.includes(interaction.user.id)) {
        try {
          const res = await PastaModel.findOne({ word });
          if (!res) {
            let embed = new MessageEmbed()
              .setColor("RED")
              .setDescription(
                `<a:RedTick:736282199258824774> **|| A pasta for \`${word}\` doesn't exist!**`
              );

            return interaction.reply({ embeds: [embed] });
          } else {
            res.pasta = content;
            await res.save();

            let embed = new MessageEmbed()
              .setColor("GREEN")
              .setDescription(
                `<a:GreenTick:736282149094949096> **|| ${interaction.user} updated the note for \`${word}\`**`
              );
            return interaction.reply({ embeds: [embed] });
          }
        } catch (err) {
          console.error(err);
        }
      }

      try {
        const res = await PastaModel.findOne({
          word,
          "user.id": interaction.user.id,
        });
        if (!res) {
          let embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `<a:RedTick:736282199258824774> **|| A pasta for \`${word}\` doesn't exist or is not owned by you!**`
            );

          return interaction.reply({ embeds: [embed] });
        } else {
          res.pasta = content;
          await res.save();

          let embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `<a:GreenTick:736282149094949096> **|| ${interaction.user} updated the note for \`${word}\`**`
            );
          return interaction.reply({ embeds: [embed] });
        }
      } catch (err) {
        console.error(err);
      }
    } else if (subcommand === "info") {
      const word = interaction.options.getString("word") as string;

      const res = await PastaModel.findOne({ word });
      if (!res) {
        let embed = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `NO PASTA EXISTS FOR \`${word}\` <a:exclamation:741988026296696872>`
          );
        return interaction.reply({ embeds: [embed] });
      } else {
        let embed = new MessageEmbed()
          .setColor("RANDOM")
          .setThumbnail("https://i.imgur.com/ZFvUtno.gif")
          .setTitle(`📝 Note Information: ${res.word}`)
          .setDescription(
            `**Created by:** ${res.user.name} \`[${res.user.id}]\`\n**Created at:** ${res.guild.name}\n**Created on:** ${res.time}`
          )
          .setFooter({
            text: `Requested by: ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          });
        return interaction.reply({ embeds: [embed] });
      }
    }
  }
}
