import mongoose, { ConnectOptions } from "mongoose";
import { Client } from "discord.js";
import { error } from "../utilities/logger";

const CONNECTION_URL = process.env.MONGODB_URL || "mongodb://localhost/main";

export default (client: Client) => mongoose.connect(CONNECTION_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions)
  .then(() => {
  // Send database connection message to sharder
    client.cluster.send({ database: true });
  }).catch((err) => {
    error("SEVERE - An error occured during database connection:");
    console.error(err);
    error("Exiting program..");
    process.exit(0);
  });
