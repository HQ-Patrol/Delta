module.exports = {
  name: "store",
  category: "information",
  description: "Links you to Patrol Bot Store/Website",
  alises: ["website"],
  cooldown: 5,
  run: async (client, message, args) => {
    message.channel.send(
      "Hey! <:EricaHeartEyes:897841580654878760>\nIf you're interested in Purchasing some Patrol Bot Premium <a:Premium1M:875427336898625586>, RARE Mystery Boxes <:MysteryBoxXXX:855561382795149322> or Craziest Spawn Rate Eggs <:HardBoiledEgg:922055217539854337>\n👉 __**Visit our Store**__: https://patrolbot.xyz/store",
    );
  },
};
