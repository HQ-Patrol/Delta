import { Client } from "discord.js";

export interface Event {
  event: string,
  handler: (client: Client, ...args: any[]) => Promise<void>
}
