module.exports = {
  name: "event",
  category: "christmas",
  aliases: ["events"],
  cooldown: 1,
  description: "Shows all the information about an on-going bot event!",
  run: async (_client, message, _args) => {
    // TODO: Maybe make a dynamic event system, pref using APIs?

    message.author.send("No event running at the moment. Try again near the festival times <:EricaThumbsUp:898319470882349067>");
  },
};
