import { Client } from "discord.js";

export interface Event {
  event: string,
  handle: (client: Client, ...args: any[]) => Promise<void>
}
