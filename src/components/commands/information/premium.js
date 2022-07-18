const Discord = require("discord.js");
const Guild = require("../../../database/models/GuildModel");

module.exports = {
  name: "premium",
  description: "✨ To see all Premium features Patrol Bot offers to it's Special users ✨",
  cooldown: 10,
  usage: "premium",
  category: "information",
  aliases: ["donate"],
  run: async (client, message, args) => {
    const guild = await Guild.findOne({ _id: message.guild.id }).lean();

    const Embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Patrol Bot Premium Perks:", iconURL: "https://i.imgur.com/ceVxXxK.gif" })
      .setDescription("Visit https://patrolbot.xyz/store or [**Click here**](https://patrolbot.xyz) to purchase Premium!\n\n"
            + `➽ **${guild.prefix}weekly**: Get Special Weekly Prize of: Mystery Box and Medium Boiled Egg exclusive to only Premium! <a:Cheers:738820410681851915>\n`
            + "➽ **Pets Limit**: Increase your Total Pets Capacity from Maximum of `10` to **`20` <a:QuaggiGIF:927190477118263296>** \n"
            + "➽ **Voting Commands**: All Voting cooldowns (Simpvote, Social-credit, Mod-vote, etc) gets their cooldown reduced by `50%` <a:GoVote:787376884731478046>\n"
            + "➽ **Exclusive Tasks**: Be able to complete all Premium-only Weekly and Monthly tasks for FREE Rare Mystery Boxes <a:FindingNukes:728258193565810778>\n"
            + `➽ **${guild.prefix}work**: Get upto 5 extra high paying jobs <:EricaEvilPlotting:897841584647847986>\n`
            + `➽ **${guild.prefix}fight ON/OFF**: Turn off fight-mode at your own will and never lose/get muted <a:LetsFight:771073637376852030>\n`
            + `➽ **${guild.prefix}vote**: Get \`x2\` the reward a normal users get per vote! <:Topgg:850043780702797854>\n`
            + "➽ **Item Usage**: Increase from `3` at a time to **`25`** <:GotThat:842141052752363543>\n"
            + "➽ **Special Item - Snitch Demon**: If activated and someone tries robbing you, empties robber's wallet and Bank upto `50%` <a:robbery:775808009825157178>\n"
            + "➽ **Wallet Locks Limit**: Increase from `50` at a time to `150` <a:Lock:744641130792222730>\n"
            + `➽ **${guild.prefix}cookie bag**: Know how many cookies you've distributed in a server and who's your fav person to give cookies to! <a:PandaEat:796098914758426675>\n`
            + `➽ **${guild.prefix}AFK**: Let's you add Links in your AFK Message <a:Notes:752905873357013094>\n`
            + `➽ **${guild.prefix}createnotes | ${guild.prefix}setcaption | ${guild.prefix}setdescription** -\nDouble your word limit and Links get by-passed! <a:NoteTaking:752914759992475779>\n`
            + `➽ **${guild.prefix}marry prenup**: Sign a prenuptial with your partner while getting married to avoid losing any money if a divorce strikes <a:HamsterJigga:731172699639906397>\n`
            + `➽ **${guild.prefix}reps/modvotes/simpvotes info**: Let's you see more information about your Votes History <a:BarryTheNerd:916028055099678780>\n`
            + "➽ **Premium-Only Giveaways**: Be allowed to Participate in the Exclusive Premium users-Only Giveaways in [__Patrol Bot HQ/Support__](https://discord.gg/HQ) <a:Tada:760515869603790928>")
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
