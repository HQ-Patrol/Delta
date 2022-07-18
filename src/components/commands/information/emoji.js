module.exports = {
  name: "emoji",
  description: "Wanna get a bigger version or the link of any custom emoji you like? Use this.",
  cooldown: 1,
  category: "information",
  aliases: ["showemoji", "emote"],
  usage: "emoji <CustomeEmote>",
  run: async (client, message, args) => {
    try {
      args.forEach((emoji) => {
        const id = emoji.split(":")[2].substring(0, emoji.split(":")[2].length - 1);
        if (emoji.substring(1).split(":")[0] !== "a") {
          message.channel.send(`https://cdn.discordapp.com/emojis/${id}.png`);
          return;
        }
        message.channel.send(`https://cdn.discordapp.com/emojis/${id}.gif`);
      });
    } catch (e) {
      message.reply("I think you did something wrong there chief!");
    }
  },
};
