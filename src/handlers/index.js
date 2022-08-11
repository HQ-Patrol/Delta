const allFiles = require("../utilities/allFiles");

const events = (client) => new Promise((resolve) => {
  allFiles("./src/components/events")
    .filter((file) => file.endsWith(".js"))
    .forEach((file, i, a) => {
      try {
        file = file.replace(/\\/g, "/").replace("src/", "");
        const event = require(`../${file}`);
        client.events.set(event.event, event);
        client.on(event.event, (...args) => event.handle(client, ...args));
        delete require.cache[require.resolve(`../${file}`)];
        if (i === a.length - 1) resolve(true);
        client.statistics.events += 1;
      } catch (e) {
        console.warn(e);
      }
    });
});

const commands = (client) => new Promise((resolve) => {
  allFiles("./src/components/commands")
    .filter((file) => file.endsWith(".js"))
    .forEach((file, i, a) => {
      try {
        file = file.replace(/\\/g, "/").replace("src/", "");
        if (file.split("/").at(-1).startsWith("@")) return;
        const command = require(`../${file}`);
        if (!command?.name) return;
        client.commands.set(
          command.name.toLowerCase(),
          command,
        );
        delete require.cache[require.resolve(`../${file}`)];
        if (i === a.length - 1) resolve(true);
        client.statistics.commands += 1;
      } catch (e) {
        console.warn(e);
      }
    });
});

const extenders = () => new Promise((resolve) => {
  allFiles("./src/components/extenders")
    .filter((file) => file.endsWith(".js"))
    .forEach((file, i, a) => {
      try {
        file = file.replace(/\\/g, "/").replace("src/", "");
        if (file.split("/").at(-1).startsWith("@")) return;
        require(`../${file}`);
        delete require.cache[require.resolve(`../${file}`)];
        if (i === a.length - 1) resolve(true);
      } catch (e) {
        console.warn(e);
      }
    });
});

module.exports = async (client) => {
  events(client);
  commands(client);
  extenders();
};
