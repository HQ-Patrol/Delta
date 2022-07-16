const mongoose = require("mongoose");
const $ = require("chalk");
const { error } = require("../utilities/logger");

const CONNECTION_URL = process.env.MONGODB_URL || "mongodb://localhost/main";

module.exports = (client) => mongoose.connect(CONNECTION_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  // Send database connection message to sharder
  client.cluster.send({ database: true });
}).catch((err) => {
  error("SEVERE - An error occured during database connection:");
  console.error(err);
  error("Exiting program..");
  process.exit(0);
});
