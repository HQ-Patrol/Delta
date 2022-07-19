const $ = require("chalk");
const mongoose = require("mongoose");
const Discord = require("discord.js");

const User = require("../../database/models/UserModel");
const Guild = require("../../database/models/GuildModel");

const findOneLeanOrCreate = require("../../database/functions/findOneLeanOrCreate");
const { log, error } = require("../../utilities/logger");

const cooldowns = new Discord.Collection();

module.exports = {
  event: "messageCreate",
  name: "Command Handler",
  handle: async (client, message) => {
    if (message.author.bot) return;
    if (
      ![
        Discord.ChannelType.GuildText,
        Discord.ChannelType.GuildNews,
        Discord.ChannelType.GuildVoice,
      ].includes(message.channel.type)
    ) return;

    // Guild information
    const guildData = await findOneLeanOrCreate(
      { _id: message.guild.id },
      {
        _id: message.guild.id,
        name: message.guild.name,
        ownerId: message.guild.ownerId,
        nsfw: true,
        chibi: false,
      },
      Guild,
    );

    // set message prefix for lower query rates
    message.prefix = guildData.prefix;
    if (new RegExp(`<@!?${client.user.id}>`).test(message.content)) {
      message.channel.send(
        `The bot prefix is: ${`\`${guildData.prefix}\``}`,
      );
      return;
    }
    if (!message.content.startsWith(guildData.prefix)) return;

    // Arguments
    const args = message.content
      .slice(guildData.prefix.length)
      .trim()
      .split(/ +/g);

    // Validate command
    const command = args.shift().toLowerCase();
    if (command.length === 0) return;
    const cmd = client.commands.get(command)
      || client.commands.find(
        (c) => c.aliases && c.aliases.includes(command),
      );
    if (!cmd) return;

    // Command data
    let commandData = guildData.commands.find((x) => x.name === cmd.name);
    if (!commandData) {
      commandData = {
        name: cmd.name,
        disabled: false,
      };
      guildData.commands.push(commandData);
      await Guild.updateOne({ _id: message.guild.id }, { commands: guildData.commands });
    }

    // New Cooldown-----
    if (!cooldowns.has(cmd.name)) {
      cooldowns.set(cmd.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldownAmount = (cmd.cooldown || 1) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        message.channel.send({
          embeds: [new Discord.EmbedBuilder()
            .setTitle("Command Cooldown")
            .setColor("Red")
            .setDescription(`<a:exclamation:741988026296696872> Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the \`${cmd.name}\` command <a:exclamation:741988026296696872>`)],
        }).then((m) => setTimeout(() => m.delete(), 5000));
        return;
      }
    } else {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    // New Cooldown-------------------------------------

    // Run the command
    if (cmd) {
      // if(amt1 === amt2) {
      // eslint-disable-next-line max-len
      //   if(message.guild.id !== "762930246596427816") { message.channel.send(`⚠️ __**Regular commands are being REPLACED with Slash Commands starting 1st April**__ ⚠️\n*\`Regular commands will no longer work and the bot will only respond to Slash commands, Type: ${guildData.prefix}support and Join Server to know more!\`* <:EricaThumbsUp:898319470882349067>`) }
      // }

      // Log
      log("CMD", `${$.bold(message.author.tag)} [${message.author.id}] used ${$.bold(command)} in ${message.guild.name} [${message.guild.id}]`, "white", client.cluster.id);

      try {
        if (!commandData || commandData.disabled) return;

        // User Data
        const userData = await findOneLeanOrCreate(
          { _id: message.author.id },
          { _id: message.author.id, premium: false, blacklisted: false },
          User,
        );

        if (userData.blacklisted && userData.blacklisted === true) return;
        await cmd.run(client, message, args);

        // TODO: Implement MB1, MB2, XP-COIN Addition
      } catch (err) {
        error(`An error occured while running the ${$.bold(command)} command:`);

        if (err instanceof mongoose.Error) console.error(err.errors);
        else console.error(err);
      }
    }
  },
};
