const allFiles = require("../utilities/allFiles");

const events = (client) =>
  new Promise((resolve, reject) => {
    allFiles("./events")
      .filter((file) => file.endsWith(".js"))
      .forEach((file, i, a) => {
        try {
          file = file.replace(/\\/g, "/");
          const event = require(`./${file}`);
          client.events.set(event.name, event);
          client.on(event.event, (...args) =>
            event.handle(client, ...args)
          );
          delete require.cache[require.resolve(`./${file}`)];
          if (i === a.length - 1) resolve(true);
          client.statistics.events++;
        } catch (e) {
          console.warn(e);
        }
      });
  });

const commands = (client) =>
  new Promise((resolve, reject) => {
    allFiles("./commands")
      .filter((file) => file.endsWith(".js"))
      .forEach((file, i, a) => {
        try {
          file = file.replace(/\\/g, "/");
          if (file.split("/")[2].startsWith("@")) return;
          const command = require(`./${file}`);
          if(!command?.name) return;
          client.commands.set(
            command.name.toLowerCase(),
            command
          );
          delete require.cache[require.resolve(`./${file}`)];
          if (i === a.length - 1) resolve(true);
          client.statistics.commands++;
        } catch (e) {
          console.warn(e);
        }
      });
  });

module.exports = (client) => {
  return Promise.allSettled([events(client), commands(client)]);
};