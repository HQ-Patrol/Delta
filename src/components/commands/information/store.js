module.exports = {
  name: "store",
  category: "information",
  description: "Links you to Patrol Bot Store/Website",
  alises: ["website"],
  cooldown: 5,
  run: async (client, message, args) => {
    message.channel.send(
      `Hey! ${client.e.ericaHeartEyes}\nIf you're interested in Purchasing some Patrol Bot Premium ${client.e.premium1M}, RARE Mystery Boxes ${client.e.mysteryBoxXXX} or Craziest Spawn Rate Eggs ${client.e.hardBoiledEgg}\n👉 __**Visit our Store**__: https://patrolbot.xyz/store`,
    );
  },
};
