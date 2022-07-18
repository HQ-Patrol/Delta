const ms = require("ms");

module.exports = {
  name: "uptime",
  category: "information",
  description: "Displays bot's current uptime!",
  run: async (client, message, args) => {
    message.channel.send(`My uptime is \`${ms(client.uptime, { long: true })}\` <a:Loading:727148666837663765>`);
  },
};
