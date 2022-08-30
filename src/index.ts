// ----------------------------------------------
// | Patrol Bot Delta                           |
// | Provided by the HQ Development Team        |
// | Copyright © 2022 HQ                        |
// ----------------------------------------------

// This file is supposed to be ran to start the bot.
// It handles sharding and basic startup.

/* Startup */
import dotenv from "dotenv";
import Cluster, { ManagerOptions } from "discord-hybrid-sharding";
import $ from "chalk";
import * as path from "path";
import * as PACKAGE_INFO from "../package.json";

import ms from "ms";
import { info, log } from "./utilities/logger";

dotenv.config();

const TIME = Date.now();
let allReady = false;

log("STARTUP", `Starting Patrol Bot Delta v${$.bold(PACKAGE_INFO.version ?? "None")}`);

const shardingOptions = {
  totalShards: 5,
  shardsPerClusters: 2,
  mode: "process"
} as ManagerOptions;

// Read developer mode
if (process.env?.DEV === "TRUE") {
  info("Launching Patrol Bot in developer mode.");
  shardingOptions.totalShards = 1;
  shardingOptions.shardsPerClusters = 1;
}

// Create shards
const sharder = new Cluster.Manager(path.join(__dirname, "..", "src", "bot.js"), shardingOptions);

// Implement HeartbeatSystem
sharder.extend(
  new Cluster.HeartbeatManager({
    interval: 2000,
    maxMissedHeartbeats: 5,
  }),
);

// Bind sharder events
sharder.on("clusterCreate", (cluster) => {
  log("SHARDER", `I have launched shard ID ${cluster.id}.`, "magenta");

  cluster.on("message", (message) => {
    const TIMESTAMP = $.bold(`(${ms(Date.now() - TIME)})`);
    if (message?.database) log("SHARDER", `This shard has connected to its database. ${TIMESTAMP}`, "blue", message.instance.id);

    if (message?.database && cluster.id === (shardingOptions.totalShards as number) - 1 && !allReady) {
      // Last shard completed, log
      allReady = true;
      log("SHARDER", `All shards launched and ready. ${TIMESTAMP}`, "green");
    }
  });
  cluster.on("ready", () => {
    const TIMESTAMP = $.bold(`(${ms(Date.now() - TIME)})`);
    log("SHARDER", `This shard is ready. ${TIMESTAMP}`, "blue", cluster.id.toString());
  })
});

// Spawn
sharder.spawn({ timeout: -1 });
