const Discord = require("discord.js");
const Guild = require("../../../database/models/GuildModel");

module.exports = {
  name: "premium",
  description: "✨ To see all Premium features Patrol Bot offers to it's Special users ✨",
  cooldown: 10,
  usage: "premium",
  category: "information",
  aliases: ["donate"],
  run: async (client, message, _args) => {
    const guild = await Guild.findOne({ _id: message.guild.id }).lean();

    const Embed = new Discord.EmbedBuilder()
      .setAuthor({ name: "Patrol Bot Premium Perks:", iconURL: "https://i.imgur.com/ceVxXxK.gif" })
      .setDescription("Visit https://patrolbot.xyz/store or [**Click here**](https://patrolbot.xyz) to purchase Premium!\n\n"
            + `➽ **${guild.prefix}weekly**: Get Special Weekly Prize of: Mystery Box and Medium Boiled Egg exclusive to only Premium! ${client.e.cheers}\n`
            + `➽ **Pets Limit**: Increase your Total Pets Capacity from Maximum of \`10\` to **\`20\` ${client.e.quaggiGIF}** \n`
            + `➽ **Voting Commands**: All Voting cooldowns (Simpvote, Social-credit, Mod-vote, etc) gets their cooldown reduced by \`50%\` ${client.e.goVote}\n`
            + `➽ **Exclusive Tasks**: Be able to complete all Premium-only Weekly and Monthly tasks for FREE Rare Mystery Boxes ${client.e.findingNukes}\n`
            + `➽ **${guild.prefix}work**: Get upto 5 extra high paying jobs ${client.e.ericaEvilPlotting}\n`
            + `➽ **${guild.prefix}fight ON/OFF**: Turn off fight-mode at your own will and never lose/get muted ${client.e.letsFight}\n`
            + `➽ **${guild.prefix}vote**: Get \`x2\` the reward a normal users get per vote! ${client.e.topgg}\n`
            + `➽ **Item Usage**: Increase from \`3\` at a time to **\`25\`** ${client.e.gotThat}\n`
            + `➽ **Special Item - Snitch Demon**: If activated and someone tries robbing you, empties robber's wallet and Bank upto \`50%\` ${client.e.robbery}\n`
            + `➽ **Wallet Locks Limit**: Increase from \`50\` at a time to \`150\` ${client.e.lock}\n`
            + `➽ **${guild.prefix}cookie bag**: Know how many cookies you've distributed in a server and who's your fav person to give cookies to! ${client.e.pandaEat}\n`
            + `➽ **${guild.prefix}AFK**: Let's you add Links in your AFK Message ${client.e.notes}\n`
            + `➽ **${guild.prefix}createnotes | ${guild.prefix}setcaption | ${guild.prefix}setdescription** -\nDouble your word limit and Links get by-passed! ${client.e.noteTaking}\n`
            + `➽ **${guild.prefix}marry prenup**: Sign a prenuptial with your partner while getting married to avoid losing any money if a divorce strikes ${client.e.hamsterJigga}\n`
            + `➽ **${guild.prefix}reps/modvotes/simpvotes info**: Let's you see more information about your Votes History ${client.e.barryTheNerd}\n`
            + `➽ **Premium-Only Giveaways**: Be allowed to Participate in the Exclusive Premium users-Only Giveaways in [__Patrol Bot HQ/Support__](https://discord.gg/HQ) ${client.e.tada}`)
      .setFooter({ text: "🌟 Lots of Premium features in works for future drops!🤓" });

    return message.author
      .send({ embeds: [Embed] })
      .then(
        message.channel.send(
          `${message.author}, Check your DMs for all the Information Premium Patrol Bot-related 🤩`,
        ),
      )
      .catch(() => message.channel.send(
        "`Unlucky! You have your DM's closed` <:sus:715633189871419554>",
      ));
  },
};
