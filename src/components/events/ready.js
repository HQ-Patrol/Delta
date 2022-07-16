module.exports = {
  name: "ready",
  handle: (client) => {
    // Respond to sharder
    client.cluster.send({ ready: true });
  },
};
