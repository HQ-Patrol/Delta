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
import path from "path";
import ms from "ms";
import { info, log } from "./utilities/logger";

import PACKAGE_INFO from "../package.json";

dotenv.config();

const TIME = Date.now();
let allReady = false;

log("STARTUP", `Starting Patrol Bot Delta v${$.bold(PACKAGE_INFO.version ?? "None")}`);

const shardingOptions: ManagerOptions = {
  totalShards: 5,
  shardsPerClusters: 2,
  mode: "process",
};

// Read developer mode
if (process.env?.DEV === "TRUE") {
  info("Launching Patrol Bot in developer mode.");
  shardingOptions.totalShards = 1;
  shardingOptions.shardsPerClusters = 1;
}

export default { DEVELOPER_MODE: process.env?.DEV === "TRUE" };

// Create shards
const sharder = new Cluster.Manager(path.join(__dirname, "bot.js"), shardingOptions);

// Implement HeartbeatSystem
sharder.extend(
  new Cluster.HeartbeatManager({
    interval: 2000,
    maxMissedHeartbeats: 5,
  }),
);

// Bind sharder events
sharder.on("clusterCreate", (cluster) => {
  log("SHARDER", `I have launched shard ID ${cluster.id}.`, "magentaBright");

  cluster.on("message", (message) => {
    const TIMESTAMP = $.bold(`(${ms(Date.now() - TIME)})`);
    if (message?.ready) log("SHARDER", `This shard is ready. ${TIMESTAMP}`, "blue", message.instance.id);
    if (message?.database) log("SHARDER", `This shard has connected to its database. ${TIMESTAMP}`, "blue", message.instance.id);

    if (message?.database && message.instance.id === (shardingOptions.totalShards as number) - 1 && !allReady) {
      // Last shard completed, log
      allReady = true;
      log("SHARDER", `All shards launched and ready. ${TIMESTAMP}`, "green");
    }
  });
});

// Spawn
sharder.spawn({ timeout: -1 });
