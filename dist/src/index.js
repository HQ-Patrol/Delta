"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const discord_hybrid_sharding_1 = __importDefault(require("discord-hybrid-sharding"));
const chalk_1 = __importDefault(require("chalk"));
const path = __importStar(require("path"));
const PACKAGE_INFO = __importStar(require("../package.json"));
const ms_1 = __importDefault(require("ms"));
const logger_1 = require("./utilities/logger");
dotenv_1.default.config();
const TIME = Date.now();
let allReady = false;
(0, logger_1.log)("STARTUP", `Starting Patrol Bot Delta v${chalk_1.default.bold((_a = PACKAGE_INFO.version) !== null && _a !== void 0 ? _a : "None")}`);
const shardingOptions = {
    totalShards: 5,
    shardsPerClusters: 2,
    mode: "process"
};
if (((_b = process.env) === null || _b === void 0 ? void 0 : _b.DEV) === "TRUE") {
    (0, logger_1.info)("Launching Patrol Bot in developer mode.");
    shardingOptions.totalShards = 1;
    shardingOptions.shardsPerClusters = 1;
}
const sharder = new discord_hybrid_sharding_1.default.Manager(path.join(__dirname, "..", "src", "bot.js"), shardingOptions);
sharder.extend(new discord_hybrid_sharding_1.default.HeartbeatManager({
    interval: 2000,
    maxMissedHeartbeats: 5,
}));
sharder.on("clusterCreate", (cluster) => {
    (0, logger_1.log)("SHARDER", `I have launched shard ID ${cluster.id}.`, "magenta");
    cluster.on("message", (message) => {
        const TIMESTAMP = chalk_1.default.bold(`(${(0, ms_1.default)(Date.now() - TIME)})`);
        if (message === null || message === void 0 ? void 0 : message.ready)
            (0, logger_1.log)("SHARDER", `This shard is ready. ${TIMESTAMP}`, "blue", message.instance.id);
        if (message === null || message === void 0 ? void 0 : message.database)
            (0, logger_1.log)("SHARDER", `This shard has connected to its database. ${TIMESTAMP}`, "blue", message.instance.id);
        if ((message === null || message === void 0 ? void 0 : message.database) && message.instance.id === shardingOptions.totalShards - 1 && !allReady) {
            allReady = true;
            (0, logger_1.log)("SHARDER", `All shards launched and ready. ${TIMESTAMP}`, "green");
        }
    });
});
sharder.spawn({ timeout: -1 });
