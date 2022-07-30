const { PermissionFlagsBits } = require("discord-api-types/v10");
const {
  EmbedBuilder,
} = require("discord.js");
const { safe } = require("../../../utilities/messagePromiseSafe");

const parseRegex = /(\w+)\s(#[\da-f]{3,6})$/i;

module.exports = {
  name: "addrole",
  description: "A role utility command",
  usage: "addrole <name> #HexColor",
  category: "moderation",
  cooldown: 1,
  async run(client, message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)
      || !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.sendError(`You do not have perms, ${message.user.toString()}`);
    }

    const matched = args.join(" ").match(parseRegex);
    if (!matched || matched.length !== 3) {
      return message.reply(`**Not gonna work!**\nMake sure your hex color is valid!\nExample: \`${this.name} Pinky #ff29f1\``);
    }

    const [, name, color] = matched;

    const embed = new EmbedBuilder()
      .setTitle("New role created!")
      .setDescription(`${message.author.username} has created the role {0}\nHex: \`${color}\`\nID: {1}`, `\`${name}\``)
      .setColor(color);

    const msgSend = message.channel.send({ embeds: [embed] });
    const roleCreate = message.guild.roles.create({ name, color }).catch();

    msgSend.then(safe(async (msg) => {
      const role = await roleCreate;
      msg.edit({ embeds: [embed.setDescriptionFinished(role.toString(), `\`${role.id}\``)] });
    }));

    return true;
  },
};
