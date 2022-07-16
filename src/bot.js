const Discord = require("discord.js");
const Cluster = require("discord-hybrid-sharding");
const { error } = require("./utilities/logger");

// Create client instance
const client = new Discord.Client({
  allowedMentions: { parse: ["roles", "users"], repliedUser: true },
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILDS,
  ],
  partials: ["CHANNEL"],
  shards: Cluster.data.SHARD_LIST,
  shardCount: Cluster.data.TOTAL_SHARDS,
});

client.cluster = new Cluster.Client(client);

// Inititalise collections
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// Run handlers
require("./handers")(client);

// Log in
if(!process.env.TOKEN || process.env.TOKEN.length === 0) return error("You have not provided a token in your .env!");
client.login(process.env.TOKEN);


