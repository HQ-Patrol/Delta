import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import { MessageEmbed, TextChannel, User } from "discord.js";

@ApplyOptions<Command.Options>({
  name: "candytrade",
  description: "Trade/Give candies!",
})
export class CandyTradeCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Who is the user?")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("numbertogive")
            .setDescription("How much candy do you want to give?")
            .setRequired(true)
            .setMinValue(1)
        )
        .addStringOption((option) =>
          option
            .setName("candytogive")
            .setDescription("What's the candy that you want to give?")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("numbertotake")
            .setDescription("How much candy do you want to take?")
            .setRequired(false)
            .setMinValue(1)
        )
        .addStringOption((option) =>
          option
            .setName("candytotake")
            .setDescription("What's the candy that you want to take?")
            .setRequired(false)
        )
    );
  }
  // "ctrade <user> <numberToGive> <candyToGive> (numberToTake) (candyToTake)",

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const numberToGive = interaction.options.getInteger("numbertogive");
    const candyToGive = interaction.options
      .getString("candytogive")
      ?.toLowerCase()
      .replace(/candy button/g, "candybutton")
      .replace(/candy stick/g, "candystick")
      .replace(/mint candy/g, "mintcandy")
      .replace(/jolly rancher/g, "jollyrancher")
      .replace(/jelly bean/g, "jellybean")
      .replace(/gummy bear/g, "gummybear")
      .replace(/wonka bar/g, "wonkabar")
      .replace(/candy cane/g, "candycane")
      .replace(/candy button/g, "candybutton")
      .replace(/bubble gum/g, "bubblegum")
      .replace(/sour patch/g, "sourpatch")
      .replace(/ stone/g, "stone");

    const numberToTake = interaction.options.getInteger("numbertotake");
    const candyToTake = interaction.options
      .getString("candytotake")
      ?.toLowerCase()
      .replace(/candy button/g, "candybutton")
      .replace(/candy stick/g, "candystick")
      .replace(/mint candy/g, "mintcandy")
      .replace(/jolly rancher/g, "jollyrancher")
      .replace(/jelly bean/g, "jellybean")
      .replace(/gummy bear/g, "gummybear")
      .replace(/wonka bar/g, "wonkabar")
      .replace(/candy cane/g, "candycane")
      .replace(/candy button/g, "candybutton")
      .replace(/bubble gum/g, "bubblegum")
      .replace(/sour patch/g, "sourpatch")
      .replace(/ stone/g, "stone");

    const user1 = interaction.user;
    const user2 = interaction.options.getUser("user") as User;
    if (!user2 || !numberToGive || !candyToGive)
      return interaction.reply(
        'You forgot a necessary argument!\n__**Usage:**__ `/candytrade <user> <numberToGive> <candyToGive> (numberToTake) (candyToTake)`\n Options inside -> "()" are Optional.'
      );
    if (user2.id === user1.id)
      return interaction.reply(
        "You can't trade with yourself dumbass! <a:LmaoBlast:741346535358595072><a:RedTick:736282199258824774>"
      );
    const give = candyToGive.toLowerCase();
    const givenum = numberToGive;
    const take = (candyToTake || "Nothing").toLowerCase();

    const takenum = numberToTake || 0;

    const player1 = await Candy.findOne({ id: user1.id }).exec();
    if (!player1)
      return interaction.reply(
        "You haven't started your Candy Pilgrimage yet! Type: `!trickortreat` to get started <:Skittles1:747102800835641435><:Skittles2:747102801221517452>"
      );
    const player2 = await Candy.findOne({ id: user2.id }).exec();
    if (!player2)
      return interaction.reply(
        `${user2.toString()} haven't started their journey to the Candy Land yet!`
      );
    if (!Object.keys(player1.candy).includes(give))
      return interaction.reply(
        "You provided an invalid candy ID! Check `/candylist` for all the candies and IDs."
      );
    // @ts-ignore
    if (player1.candy[give] < givenum)
      return interaction.reply(
        `__*You don't have enough ${give} to give!*__\nUse: \`/trickortreat\` to get a random candy and \`/candybag\` to view your inventory.`
      );
    if (take === "nothing") {
      await Candy.findOneAndUpdate(
        { id: user1.id },
        {
          candy: Object.assign(player1.candy, {
            // @ts-ignore
            [give]: player1.candy[give] - givenum,
          }),
          CandyCount: player1.CandyCount - givenum,
        }
      );
      await Candy.findOneAndUpdate(
        { id: user2.id },
        {
          candy: Object.assign(player2.candy, {
            // @ts-ignore
            [give]: player2.candy[give] + givenum,
          }),
          CandyCount: player2.CandyCount + givenum,
        }
      );
      await interaction.reply(
        "`Candy Trade successful` <a:GreenTick:736282149094949096>"
      );
      (
        (await interaction.client.channels.cache.get(
          "805161104346447872"
        )) as TextChannel
      ).send(
        `${user2.toString()} [${user2.id}], ${user1.toString()} [${
          user2.id
        }] gave \`x${givenum}\` **${give}** in ${interaction.guild} [${
          interaction.guild?.id
        }]`
      );
    } else {
      if (!Object.keys(player1.candy).includes(take))
        return interaction.reply(
          "You provided an invalid candy name! Check `/CandyList` for all the Candy Names"
        );
      // @ts-ignore
      if (player2.candy[take] < takenum)
        return interaction.reply(
          `${user2.toString()} does not have enough ${take} to give! Use \`/candybag (user)\` to view their inventory.`
        );
      const embed = new MessageEmbed()
        .setAuthor(
          "Trade Offer ⚖",
          interaction.user.displayAvatarURL({ dynamic: true })
        )
        .setColor("RANDOM")
        .setDescription(
          `${user2.toString()}, ${user1.toString()} requested to trade \`x${givenum}\` **${give}** in exchange for \`x${takenum}\` **${take}**!\*`
        ) //\nYou have 60 seconds to react with ✅ or ❌ to accept or decline the offer.`)
        .setFooter({
          text: "You have 60 seconds to react with ✅ or ❌ to accept or decline the offer.",
        });
      const offerembed = (await interaction.reply({
        embeds: [embed],
      })) as any;
      await offerembed.react("✅");
      await offerembed.react("❌");
      const filter = (r: any, u: any) =>
        u.id === user2.id && (r.emoji.name === "✅" || r.emoji.name === "❌");
      const reaction = (
        await offerembed.awaitReactions({
          filter,
          max: 1,
          time: 2 * 60000,
        })
      ).firstKey();
      if (!reaction)
        return interaction.followUp(
          `I can't sit here the whole fucking day. Time's up <:ightimmaheadout:760241994231971861>`
        );
      else if (reaction === "✅") {
        await Candy.findOneAndUpdate(
          { id: user1.id },
          {
            candy: Object.assign(player1.candy, {
              // @ts-ignore
              [give]: player1.candy[give] - givenum,
              // @ts-ignore
              [take]: player1.candy[take] + takenum,
            }),
            CandyCount: player1.CandyCount - givenum + takenum,
          }
        );
        await Candy.findOneAndUpdate(
          { id: user2.id },
          {
            candy: Object.assign(player2.candy, {
              // @ts-ignore
              [give]: player2.candy[give] + givenum,
              // @ts-ignore
              [take]: player2.candy[take] - takenum,
            }),
            CandyCount: player2.CandyCount + givenum - takenum,
          }
        );
        await interaction.followUp(
          "`Candy Trade successful` <a:GreenTick:736282149094949096>"
        );
        (
          (await interaction.client.channels.cache.get(
            "805161104346447872"
          )) as TextChannel
        ).send(
          `${user2.toString()} [${user2.id}], ${user1.toString()} [${
            user1.id
          }] TRADED \`x${givenum}\` **${give}** in exchange for \`${takenum}\` **${take}**!\* in ${
            interaction.guild
          } [${interaction.guild?.id}]`
        );
      } else if (reaction === "❌")
        return interaction.followUp(
          "`Candy Trade declined` <a:RedTick:736282199258824774>"
        );
    }
  }
}
