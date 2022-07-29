const { MessageEmbed, Message } = require("discord.js");
const { stripIndents } = require("common-tags");
const bc = require("../../botconfig.json");
const Guilds = require("../../database/models/guild");

module.exports = {
  name: "commands",
  category: "information",
  description: "Returns all commands, or one specific info",
  aliases: ["cmds", "cmd", "command"],
  cooldown: 1,
  usage: "cmd <command name>",
  example: "https://i.imgur.com/rmihrdW.gif",
  run: async (client, message, args) => {
    if (args[0]) {
      return getCMD(client, message, args[0]);
    }
    // Otherwise send all the commands available
    // Without the cmd info
    return getAll(client, message);

    const data = [];
    async function getAll(client, message) {
      const guild = await Guilds.findOne({ _id: message.guild.id }).catch((err) => console.log(err));

      // Map all the commands
      // with the specific category
      const commands = (category) => client.commands
        .filter((cmd) => cmd.category === category)
        .map((cmd) => `\`${cmd.name}\``)
        .join(" | ");
      // emoji object for the categories
      const emojis = {
        fun: "🏀",
        actions: "🕺",
        nsfw: "🔞",
        // "animals": "🐶",
        pets: "🐶",
        // "christmas": "🎅",
        economy: "💸",
        minigames: "🎲",
        // "halloween": "🎃",
        users: "👤",
        miscellaneous: "📰",
        // "images": "🖼️",
        // "voting": "📬",
        server: "🏨",
        moderation: "🛠",
        information: "🔍",
        extras: "🧐",
        // "notes": "📝",
        settings: "⚙️",
      };
      // Map all the categories
      const embedarray = [];
      const cattocommands = {};
      client.categories.forEach((cat) => cattocommands[stripIndents(`**${(emojis[cat] ? emojis[cat] : "") + cat[0].toUpperCase() + cat.slice(1)} Commands**`)] = commands(cat));
      for (i = 0; i < Math.ceil(client.categories.length / 5); i++) {
        const embed = new MessageEmbed()
          .setAuthor({ name: "Patrol Bot : Commands List", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setColor(bc.blue)
          .setDescription(`Looks like you want to see all my majestic powers? Here's the full list of all my Commands. Type \`${guild.prefix}command <Command Name>\` for more information about any command and it's Video Guide <:bet:715633188457676931>`)
        // .setFooter(`By: Sinless#0001 • 200+ Commands - Bot v2.0`, client.users.cache.get("179911663586246656").displayAvatarURL({ dynamic: true }))
          .setFooter({ text: "By: Sinless#0001 • https://patrolbot.xyz 🚨", iconURL: "https://i.imgur.com/YTMhQOx.gif" });
        for (j = i * 5; j < (i * 5) + 5; j++) {
          const entries = Object.entries(cattocommands)[j];
          // console.log(entries)
          if (!entries || entries[0] === "" || entries[1] === "") continue;
          embed.addField(entries[0], entries[1]);
        }
        embedarray.push(embed);
      }
      message.reply("Please Check your DMs for a full list of commands! <a:PatrolBot:736282237225533571>");

      try {
        const channel = await message.author.createDM();
        for (i = 0; i < embedarray.length; i++) {
          channel.send({ embeds: [embedarray[i]] });
        }
      } catch (e) {
        message.channel.send("`Unlucky! You have DM's closed` <:sus:715633189871419554>");
      }
    }

    async function getCMD(client, message, input) {
      const embed = new MessageEmbed()
        .setColor("RANDOM");
      const cmd = client.commands.get(input.toLowerCase()) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(input.toLowerCase()));

      let info = `No information found for the command **${input.toLowerCase()}**`;

      if (!cmd) {
        return message.channel.send({ embeds: [embed.setColor("RED").setDescription(info)] });
      }

      const guild = await Guilds.findOne({ _id: message.guild.id }).catch((err) => console.log(err));
      // Add all cmd info to the embed
      if (cmd.name) info = `**Command name**: ${cmd.name}`;
      if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map((a) => `\`${a}\``).join(", ")}`;
      if (cmd.description) info += `\n**Description**: ${cmd.description}`;
      if (cmd.cooldown) info += `\n**Cooldown**: \`${cmd.cooldown}\`sec`;
      if (cmd.usage) info += `\n**Usage**: ${guild.prefix}${cmd.usage}`;
      if (cmd.example) embed.setImage(cmd.example);

      embed.setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
      return message.channel.send({ embeds: [embed.setColor(bc.blue).setDescription(info)] });
    }
  },
};
