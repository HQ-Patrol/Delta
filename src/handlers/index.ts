import { Client } from "discord.js";
import allFiles from "../utilities/allFiles";
import { error } from "../utilities/logger";
import { Event } from "../types/Event";
import { Command } from "../types/Command";

const events = (client: Client) => new Promise((resolve) => {
  allFiles("./src/components/events")
    .filter((file) => file.endsWith(".js") && !(file.split("/").at(-1) || "").startsWith("@"))
    .map((file) => file.replace(/\\/g, "/").replace("src/", ""))
    .forEach((file, i, a) => {
      try {
        import(`../${file}`).then((event: Event) => {
          client.events.set(event.event, event);
          client.on(event.event, (...args) => event.handle(client, ...args));

          if (i === a.length - 1) resolve(true);
          client.statistics.events += 1;

          delete require.cache[require.resolve(`../${file}`)];
        });
      } catch (e: any) {
        // Basic error logging during production
        if (e instanceof Error) {
          if (!process.env.DEV) error(e.message);
          else console.error(e);
        }
      }
    });
});

const commands = (client: Client) => new Promise((resolve) => {
  allFiles("./src/components/commands")
    .filter((file) => file.endsWith(".js") && !(file.split("/").at(-1) || "").startsWith("@"))
    .map((file) => file.replace(/\\/g, "/").replace("src/", ""))
    .forEach((file, i, a) => {
      try {
        import(`../${file}`).then((command: Command) => {
          if (!command?.slash) return;
          client.commands.set(
            command.slash.data.name.toLowerCase(),
            command,
          );

          if (i === a.length - 1) resolve(true);
          client.statistics.commands += 1;

          delete require.cache[require.resolve(`../${file}`)];
        });
      } catch (e) {
        // Basic error logging during production
        if (e instanceof Error) {
          if (!process.env.DEV) error(e.message);
          else console.error(e);
        }
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
        // This really shouldn't happen
        console.warn(e);
      }
    });
});

export default (client: Client) => Promise.all([
  events(client),
  commands(client),
  extenders(),
]);
