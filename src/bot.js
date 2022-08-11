const Discord = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const { error } = require("./utilities/logger");

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
client.e = require("./constants/emoji");
client.utils = require("./utilities/global");

// Run handlers
require("./handlers")(client);

// Check if mongodb url is provided
if (!process.env.MONGODB_URL || process.env.MONGODB_URL.length === 0) error("You have not provided a MongoDB Connection URL in your .env!");
// Connect to mongodb
require("./database")(client);

// Log in
if (!process.env.TOKEN || process.env.TOKEN.length === 0) error("You have not provided a token in your .env!");
client.login(process.env.TOKEN);
