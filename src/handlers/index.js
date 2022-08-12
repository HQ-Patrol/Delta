const allFiles = require("../utilities/allFiles");

const events = (client) => new Promise((resolve) => {
  allFiles("./src/components/events")
    .filter((file) => file.endsWith(".js") && !file.split("/").at(-1).startsWith("@"))
    .map((file) => file.replace(/\\/g, "/").replace("src/", ""))
    .forEach((file, i, a) => {
      try {
        const event = require(`../${file}`);
        client.events.set(event.event, event);
        client.on(event.event, (...args) => event.handle(client, ...args));

        if (i === a.length - 1) resolve(true);
        client.statistics.events += 1;

        delete require.cache[require.resolve(`../${file}`)];
      } catch (e) {
        console.warn(e);
      }
    });
});

const commands = (client) => new Promise((resolve) => {
  allFiles("./src/components/commands")
    .filter((file) => file.endsWith(".js") && !file.split("/").at(-1).startsWith("@"))
    .map((file) => file.replace(/\\/g, "/").replace("src/", ""))
    .forEach((file, i, a) => {
      try {
        const command = require(`../${file}`);
        if (!command?.name) return;
        client.commands.set(
          command.name.toLowerCase(),
          command,
        );

        if (i === a.length - 1) resolve(true);
        client.statistics.commands += 1;

        delete require.cache[require.resolve(`../${file}`)];
      } catch (e) {
        console.warn(e);
      }
    });
});

const extenders = () => new Promise((resolve) => {
  allFiles("./src/components/extenders")
    .filter((file) => file.endsWith(".js"))
    .map((file) => file.replace(/\\/g, "/").replace("src/", ""))
    .forEach((file, i, a) => {
      try {
        require(`../${file}`);

        if (i === a.length - 1) resolve(true);

        delete require.cache[require.resolve(`../${file}`)];
      } catch (e) {
        console.warn(e);
      }
    });
});

module.exports = (client) => Promise.all([
  events(client),
  commands(client),
  extenders(),
]);
