import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { Economy as Eco } from "../../../database/models/EconomyModel";
import { BadgesModel as BADGES } from "../../../database/models/BadgesModel";
import Badges from "../../../data/json/badges.json";
import ALL from "../../../data/json/redeem.json";
import { MessageEmbed, TextChannel } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "candysnap",
  description:
    "Once you've collected all the infinity stones, snap your fingers!",
})
export class CandySnapCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    let player = await Candy.findOne({ id: interaction.user.id }).exec();
    if (!player)
      return interaction.reply(
        "You haven't started your Candy Pilgrimage yet! Type: `!trickortreat` to get started <:Skittles1:747102800835641435><:Skittles2:747102801221517452>"
      );
    let allcandies = Object.entries(player.candy).filter((x) =>
      x[0].endsWith("stone")
    );
    if (allcandies.some((x: any) => x[1] <= 0))
      return interaction.reply(
        "You need 1 of each Infinity Stone to snap your fingers! <a:RedTick:736282199258824774>"
      );
    let newcandies = Object.fromEntries(
      allcandies.map((x: any) => [x[0], x[1] - 1])
    );
    await Candy.findOneAndUpdate(
      { id: interaction.user.id },
      { candy: Object.assign(player.candy, newcandies), Snap: player.Snap + 1 }
    );
    let random = getRandomInt(11);
    let prize;
    let randomGif = getRandomInt(2);

    await (interaction.channel as TextChannel)?.bulkDelete(49, true);
    await new Promise((r) => setTimeout(r, 1000));

    const emb2 = new MessageEmbed().setTitle("You Snapped your fingers! ✊");

    if (randomGif === 0) {
      emb2.setImage("https://i.imgur.com/FY8GCWh.gif");
      await interaction
        .reply({ embeds: [emb2] })
        .then((n: any) => n.delete({ timeout: 7100 }));
    } else {
      emb2.setImage("https://i.imgur.com/mU3wziU.gif");
      await interaction
        .reply({ embeds: [emb2] })
        .then((n: any) => n.delete({ timeout: 13200 }));
    }

    await new Promise((r) => setTimeout(r, 1000));

    if (random === 0) {
      interaction.reply(
        "**<a:Tada:760515869603790928> Congratulations on winning <a:Coins:775714101564276756> __250,000 coins__ <a:GreenTick:736282149094949096>**"
      );
      prize = "250,000 coins";
      await Eco.updateOne(
        { id: interaction.user.id },
        { $inc: { bank: 250000 } }
      );
    } else if (random === 1) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <a:Premium1M:875427336898625586> __3 Months of Patrol Bot Premium__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "2 Month Premium";

      let resS1 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S1")) resS1 = `${d}`;
        if (resS1 !== "") break;
      }
      interaction.user
        .send(
          `__**Patrol Bot Premium (3 Months) Code**__: \`${resS1}\`\n\nUse command \`!Redeem ${resS1}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } else if (random === 2) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <:WeeklySkips:892403153566302258> __5 Weekly Skip__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "Weekly Skip";

      let resS2 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S2")) resS2 = `${d}`;
        if (resS2 !== "") break;
      }
      interaction.user
        .send(
          `__**5 Weekly Skips Code**__: \`${resS2}\`\n\nUse command \`!Redeem ${resS2}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } else if (random === 3) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <:MonthlySkips:892403155290181662> __3 Monthly Skip__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "Monthly Skip";

      let resS3 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S3")) resS3 = `${d}`;
        if (resS3 !== "") break;
      }
      interaction.user
        .send(
          `__**3 Monthly Skips Code**__: \`${resS3}\`\n\nUse command \`!Redeem ${resS3}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } else if (random === 4) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <:MysteryBoxXXX:855561382795149322> __3 Mystery Box XXX__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "Mystery Box XXX";

      let resS4 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S4")) resS4 = `${d}`;
        if (resS4 !== "") break;
      }
      interaction.user
        .send(
          `__**3 Mystery Box XXX Code**__: \`${resS4}\`\n\nUse command \`!Redeem ${resS4}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } else if (random === 5) {
      await interaction.reply(
        "**<a:Tada:760515869603790928> Congratulations on winning <a:Coins:775714101564276756> __250,000 coins__ <a:GreenTick:736282149094949096>**"
      );
      prize = "250,000 coins";
      await Eco.updateOne(
        { id: interaction.user.id },
        { $inc: { bank: 250000 } }
      );
    } else if (random === 6) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <a:Premium1M:875427336898625586> __3 Months of Patrol Bot Premium__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "2 Month Premium";

      let resS1 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S1")) resS1 = `${d}`;
        if (resS1 !== "") break;
      }
      interaction.user
        .send(
          `__**Patrol Bot Premium (3 Months) Code**__: \`${resS1}\`\n\nUse command \`!Redeem ${resS1}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } else if (random === 7) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <:WeeklySkips:892403153566302258> __5 Weekly Skip__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "Weekly Skip";

      let resS2 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S2")) resS2 = `${d}`;
        if (resS2 !== "") break;
      }
      interaction.user
        .send(
          `__**5 Weekly Skips Code**__: \`${resS2}\`\n\nUse command \`!Redeem ${resS2}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } else if (random === 8) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <:MonthlySkips:892403155290181662> __3 Monthly Skip__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "Monthly Skip";

      let resS3 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S3")) resS3 = `${d}`;
        if (resS3 !== "") break;
      }
      interaction.user
        .send(
          `__**3 Monthly Skips Code**__: \`${resS3}\`\n\nUse command \`!Redeem ${resS3}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } else if (random === 9) {
      await interaction.reply(
        "** <a:Tada:760515869603790928> Congratulations on winning <:MysteryBoxXXX:855561382795149322> __3 Mystery Box XXX__** <a:GreenTick:736282149094949096> `Check your DMs for the Prize!` <a:Tada:760515869603790928>"
      );
      prize = "Mystery Box XXX";

      let resS4 = "";
      for (let d of ALL.GOD) {
        if (String(d).startsWith("S4")) resS4 = `${d}`;
        if (resS4 !== "") break;
      }
      interaction.user
        .send(
          `__**3 Mystery Box XXX Code**__: \`${resS4}\`\n\nUse command \`!Redeem ${resS4}\` and accept your prize within 10 minutes or it expires!`
        )
        .catch(() =>
          interaction.editReply(
            "`LMAOO UNLUCKY! You had your DM's closed and couldn't receive the Prize.`**` Massive L`** <a:LmaoBlast:741346535358595072><:RestInPiss:745740745058811904>"
          )
        ); //Redeem Code DM
    } //if (random === 10)
    else {
      await interaction.reply(
        "** <a:Tada:760515869603790928>  Congratulations on winning <a:NitroFlying:807707296356368384> __Discord Nitro__ (1 Month) <a:GreenTick:736282149094949096> You shall recieve the Discord Nitro within the next 48 hours!** <a:Tada:760515869603790928>"
      );
      prize = "Discord Nitro";
    }
    (
      (await interaction.client.channels.cache.get(
        "892081659527172146"
      )) as TextChannel
    ).send(
      `${interaction.user.toString()} just snapped and won ${prize}.\nGuild: ${
        interaction.guild?.name
      }\nInvite: ${(
        (await interaction.guild?.channels.cache
          .filter((x: any) => x.type === "GUILD_TEXT")
          .first()) as TextChannel
      )?.createInvite({
        temporary: false,
        maxAge: 0,
        unique: true,
        reason: "Bot dev wanted an invite because a member earned a prize",
      })}`
    );

    //Halloween Badge Addition=========================
    var badge = Badges.badges.filter(
      (b) => b.name.toLowerCase() === "candy hunter 2021"
    )[0];

    var _badges = await BADGES.findOne({ id: interaction.user.id });

    if (!_badges) {
      var b = new BADGES({
        id: interaction.user.id,
        badges: [badge],
      });

      await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
              `<a:ThanosDance:763468378794754049> | ${interaction.user} **is being awarded with the badge: __Candy Hunter 2021__** for their exceptional performance in Patrol Bot: Halloween Event ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
            ),
        ],
      });

      await b.save();
      return;
    } else {
      var exists = await BADGES.findOne({
        id: interaction.user.id,
        badges: { $in: [badge] },
      });

      if (exists) return;

      await BADGES.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $addToSet: { badges: [badge] },
        }
      );

      await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
              `<a:ThanosDance:763468378794754049> | ${interaction.user} **is being awarded with the badge: __Candy Hunter 2021__** for their exceptional performance in Patrol Bot: Halloween Event ${badge.badge} <a:RainbowHyperTada:838456456474787840>`
            ),
        ],
      });
    }
    //==================================
  }
}
