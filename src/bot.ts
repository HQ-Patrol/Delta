import Cluster from "discord-hybrid-sharding";
import { Intents } from "discord.js";
import DeltaClient from "./utilities/classes/DeltaClient";
import { error } from "./utilities/logger";
import path from "path";

// Create client instance
const client = new DeltaClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILDS,
  ],
  partials: ["CHANNEL"],
  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,
  baseUserDirectory: path.join(__dirname, "..", "src", "components")
});

// Log in
if (!process.env.TOKEN || process.env.TOKEN.length === 0) error("You have not provided a token in your .env!");
client.login(process.env.TOKEN);
