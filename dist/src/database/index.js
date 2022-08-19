"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utilities/logger");
const CONNECTION_URL = process.env.MONGODB_URL || "mongodb://localhost/main";
function connect(client) {
    mongoose_1.default
        .connect(CONNECTION_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
        .then(() => {
        client.cluster.send({ database: true });
    })
        .catch((err) => {
        (0, logger_1.error)("SEVERE - An error occured during database connection:");
        console.error(err);
        (0, logger_1.error)("Exiting program..");
        process.exit(0);
    });
}
exports.connect = connect;
