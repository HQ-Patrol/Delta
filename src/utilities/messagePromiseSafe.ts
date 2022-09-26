import { Message } from "discord.js";

export default async (cb: (msg: Message) => void) => {
  async (msg: Message) => {
    try {
      cb(msg);
    } catch (e) {
      console.error(e);
      msg.edit({ content: "Oh no! Something went wrong.", embeds: [] });
    }
  };
};
