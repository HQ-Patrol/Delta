const Discord = require("discord.js");
const Topgg = require("@top-gg/sdk");

const topgg = new Topgg.Api("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2MzUwNjI4MDQyMTM5MjQ2NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjE0Nzg4MDEwfQ.gL96XVC3O0QRIMgfr4WikBHYIAuojjHHHhBwuw1MwhQ");
const pretty = require("pretty-ms");
const Eco = require("../../database/eco/economy");
const Weekly = require("../../database/eco/daily");
const User = require("../../database/models/user");
const ITEMS = require("../../json/items.json").items;
const userWeekly = require("../../database/models/userwm");
const userMonthly = require("../../database/models/usermm");
const petUtils = require("../../util/pets/petUtils");

module.exports = {
  name: "vote",
  description: "Vote Vote Vote for Patrol Bot! Vote every 12 hours to get an amazing rewards",
  usage: "vote",
  category: "information",
  cooldown: 3,
  example: "https://i.imgur.com/OZA7jAv.gif",
  run: async (client, message, args) => {
    const voted = await topgg.hasVoted(message.author.id);
    if (!voted) {
      return message.channel.send({
        embeds: [new Discord.MessageEmbed()
          .setThumbnail("https://i.imgur.com/ab2g21s.gif")
          .setTitle("You haven't Voted! ❌")
          .setColor("RANDOM")
          .setDescription("<a:GoVote:787376884731478046> [**Click here to Vote for Patrol Bot and show your SUPPORT!**](https://top.gg/bot/763506280421392466/vote) <:LETSFUCKINGGOOOOOOOOO:763281511003717683>"
          + "\n<:MysteryBox1:855561382896468021> **For every Vote, you can CLAIM Mystery Boxes/Eggs and 1000** <a:Coins:775714101564276756> ")
          .setFooter({ text: "You can VOTE every 12 hours ⏰" })],
      });
    }

    let q = 1;
    const userr = await User.findOne({ _id: message.author.id });
    if (!userr) return message.channel.send("Type: ${prefix}balance ");
    if (userr.premium == true) { q = 2; }
    const egg = petUtils.rndNumber(1, 5);
    if (egg == 3) { prizeName = "soft boiled egg"; } else { prizeName = "mystery box 1"; }

    let weekly = await Weekly.findOne({ id: message.author.id });
    if (!weekly) {
      weekly = new Weekly({
        id: message.author.id,
        days: 0,
        next: Date.now(),
        resets: Date.now(),
        weeklyReset: Date.now(),
        voteReset: Date.now(),
      });
      await weekly.save();
    }

    if (weekly.voteReset > Date.now()) {
      return message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle("Voting Reward Cooldown 🎁")
            .setColor("RED")
            .setDescription(`<a:RedTick:736282199258824774> **|** Please wait for **${pretty(weekly.voteReset - Date.now())}** before claiming Voting Rewards <a:PatrolBot:736282237225533571>`)],
      });
    }

    let data = await Eco.findOne({ id: message.author.id });
    if (!data) {
      data = new Eco({
        id: message.author.id,
        coins: 0,
        bank: 0,
        xp: 0,
        level: 1,
        items: [],
        bracket: 1,
      });
      await data.save();
    }

    weekly.voteReset = Date.now() + 41_400_000;
    await weekly.save();

    const item = ITEMS.find((item) => item.name.toLowerCase() == prizeName);
    const myItems = data.items;
    if (myItems.length > 0) {
      const checkMe = data.items.findIndex((item) => item.name.toLowerCase() === prizeName);
      if (checkMe >= 0) {
        const newData = data.items;
        newData[checkMe].count += q;
        await Eco.findOneAndUpdate(
          {
            id: message.author.id,
          },
          {
            items: newData,
            lastUse: Date.now(),
            $inc: { coins: 1000 },
          },
        );
      } else {
        const newData = data.items;
        newData.push({});
        newData[newData.length - 1].name = item.name;
        newData[newData.length - 1].count = q;
        newData[newData.length - 1].icon = item.icon;
        newData[newData.length - 1].type = item.type;
        newData[newData.length - 1].data = item.data;
        await Eco.findOneAndUpdate(
          {
            id: message.author.id,
          },
          {
            items: newData,
            lastUse: Date.now(),
            $inc: { coins: 1000 },
          },
        );
      }
    } else {
      await Eco.findOneAndUpdate(
        {
          id: message.author.id,
        },
        {
          items: [{
            name: item.name, count: q, type: item.type, data: item.data, icon: item.icon,
          }],
          lastUse: Date.now(),
          $inc: { coins: 1000 },
        },
      );
    }

    message.channel.send({
      embeds: [new Discord.MessageEmbed()
        .setThumbnail("https://i.imgur.com/ab2g21s.gif")
        .setTitle("Thanks for Voting! ✅🌟")
        .setColor("RANDOM")
        .setDescription(`You voted for Patrol bot! Here's your reward:\n➥ \`x${q}\` **\`${item.name}\`** ${item.icon} + \`1000\` <a:Coins:775714101564276756>`)
        .addFields("<a:CleanWoman:728219543658561606> Invite this Bot", "[Click Here](https://discord.com/api/oauth2/authorize?client_id=763506280421392466&permissions=8&scope=bot)", true)
        .addFields("<:DiscordLogo:730154954492477482> Support Server", "[Click here to Join](https://discord.gg/HQ)", true)
        .addFields("<a:PatrolBot:736282237225533571> Website", "[Click here to Visit](https://patrolbot.xyz)", true)
        .setFooter({ text: "➤ You can VOTE and CLAIM your reward every 12 hours ⏰" })],
    });

    // Weekly/Monthly Mission Section================
    const weeklyData = await userWeekly.findOne({ id: message.author.id });
    if (!weeklyData) {
      await userWeekly.create({
        id: message.author.id,
        vote: {
          value: 1,
          prize: false,
          prizePlus: false,
				  },
      });
    } else {
      if (weeklyData.vote.value > 0) { weeklyData.vote.value += 1; } else { weeklyData.vote.value = 1; }
      await weeklyData.save().catch((err) => console.log(err));
    }

    const monthlyData = await userMonthly.findOne({ id: message.author.id });
    if (!monthlyData) {
      await userMonthly.create({
        id: message.author.id,
        vote: {
          value: 1,
          prize: false,
          prizePlus: false,
				  },
      });
    } else {
      if (monthlyData.vote.value > 0) { monthlyData.vote.value += 1; } else { monthlyData.vote.value = 1; }
      await monthlyData.save().catch((err) => console.log(err));
    }
    // Weekly/Monthly END=================================================================
  },
};
