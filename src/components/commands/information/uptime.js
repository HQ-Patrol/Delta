const ms = require("ms");

module.exports = {
  name: "uptime",
  category: "information",
  description: "Displays bot's current uptime!",
  run: async (client, message, _args) => {
    const uptime = ms(client.uptime, { long: true });
    message.channel.send(`My uptime is \`${uptime}\` ${client.e.loading}`);
  },
};
