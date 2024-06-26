import Discord from "discord.js";
import Cluster from "discord-hybrid-sharding";
import { error } from "./utilities/logger";

import emojis from "./constants/emoji";

import handlers from "./handlers";

import database from "./database";

// Create client instance
const client = new Discord.Client({
  allowedMentions: { parse: ["roles", "users"], repliedUser: true },
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Discord.Partials.Channel],
  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,
});

client.cluster = new Cluster.Client(client);

// Inititalise collections
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// Bot statistics
client.statistics = {
  events: 0,
  commands: 0,
};

// Client constants
client.e = emojis;

// Run handlers
handlers(client);

// Check if mongodb url is provided
if (!process.env.MONGODB_URL || process.env.MONGODB_URL.length === 0) error("You have not provided a MongoDB Connection URL in your .env!");

// Connect to mongodb
database(client);

// Log in
if (!process.env.TOKEN || process.env.TOKEN.length === 0) error("You have not provided a token in your .env!");
client.login(process.env.TOKEN);
