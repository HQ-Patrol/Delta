module.exports = {
  name: "updates",
  category: "information",
  description: "DMs you all the information about the last Patrol Bot Update!",
  cooldown: 60,
  aliases: ["update", "whatsnew"],
  run: async (_client, message, _args) => {
    message.author
      .send(
        "Hey! For any questions and information regarding Patrol Bot Updates/Changes, Daily Giveaways/Raffles, Exclusive Benefits\n👉 __**Join the Patrol Bot Support server**__: https://discord.gg/HQ [<#762930247061995527>]",
      )
      .catch(() => message.channel.send(
        "`Unlucky! You have your DM's closed` <:sus:715633189871419554>",
      ));
    return message.react("🔎");
  },
};
