"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_hybrid_sharding_1 = __importDefault(require("discord-hybrid-sharding"));
const discord_js_1 = require("discord.js");
const DeltaClient_1 = __importDefault(require("./utilities/classes/DeltaClient"));
const logger_1 = require("./utilities/logger");
const path_1 = __importDefault(require("path"));
const client = new DeltaClient_1.default({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILDS,
    ],
    partials: ["CHANNEL"],
    shards: discord_hybrid_sharding_1.default.data.SHARD_LIST,
    shardCount: discord_hybrid_sharding_1.default.data.TOTAL_SHARDS,
    baseUserDirectory: path_1.default.join(__dirname, "..", "src", "components")
});
if (!process.env.TOKEN || process.env.TOKEN.length === 0)
    (0, logger_1.error)("You have not provided a token in your .env!");
client.login(process.env.TOKEN);
