import { Collection } from "discord.js";
import Cluster from "discord-hybrid-sharding";
import { Command } from "./Command";
import { Event } from "./Event";

type Stats = {
  events: number,
  commands: number
};

declare module "discord.js" {
  export interface Client {
    cluster: Cluster.Client
    commands: Collection<string, Command>
    events: Collection<string, Event>
    statistics: Stats
    e: { [key: string]: string }
  }
}
