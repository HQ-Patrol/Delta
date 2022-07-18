// ----------------------------------------------
// | Patrol Bot Delta                           |
// | Provided by the HQ Development Team        |
// | Copyright © 2022 HQ                        |
// ----------------------------------------------

// This file is supposed to be ran to start the bot.
// It handles sharding and basic startup.

/* Startup */
require("dotenv").config();

const Cluster = require("discord-hybrid-sharding");
const chalk = require("chalk");
const path = require("path");
const { log, info } = require("./utilities/logger");

const PACKAGE_INFO = require("../package.json");

log("STARTUP", `Starting Patrol Bot Delta v${chalk.bold(PACKAGE_INFO.version ?? "None")}`);

const shardingOptions = {
  totalShards: 5,
  shardsPerClusters: 2,
  mode: "process",
};

// Read developer mode
if (process.env?.DEV === "TRUE") {
  info("Launching Patrol Bot in developer mode.");
  shardingOptions.totalShards = 1;
  shardingOptions.shardsPerClusters = 1;
  global.developerMode = true;
}

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
    if (message?.ready) log("SHARDER", "This shard is ready.", "green", message.instance.id);
    if (message?.database) log("SHARDER", "This shard has connected to its database.", "blue", message.instance.id);
  });
});

// Spawn
sharder.spawn({ timeout: -1 });
