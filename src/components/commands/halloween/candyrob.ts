import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import humanizeDuration from "humanize-duration";
import { MessageEmbed } from "discord.js";

const simped = new Map();

@ApplyOptions<Command.Options>({
  name: "candyrob",
  description:
    "Rob candy from a person's bag if you're willing to put the same amount of your candy at stake!",
})
export class CandyFlipCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Who's the user?")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription("What's the number?")
            .setRequired(false)
            .setMinValue(5)
            .setMaxValue(100)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const cooldown = simped.get(interaction.user.id);

    if (cooldown) {
      const remaining = humanizeDuration(cooldown - Date.now(), {
        units: ["h", "m", "s"],
        round: true,
      });
      return interaction
        .reply(
          `${interaction.user}, Wait \`${remaining}\` before robbing someone again! <a:RedTick:736282199258824774>`
        )
        .catch(console.error);
    } else {
      const player = await Candy.findOne({ id: interaction.user.id });
      if (!player)
        return interaction.reply(
          `You haven't started your journey to the Candy Land yet <a:exclamation:741988026296696872>`
        );
      const torob = interaction.options.getUser("user");
      if (!torob)
        return interaction.reply(
          "`Either you didn't mention a user to rob or they havent started thier journey to the Candy Land yet` <a:exclamation:741988026296696872>"
        );
      const torobplayer = await Candy.findOne({ id: torob.id });
      if (!torobplayer)
        return interaction.reply(
          "`Either you didn't mention a user to rob or they havent started thier journey to the Candy Land yet` <a:exclamation:741988026296696872>"
        );
      const stakes = interaction.options.getInteger("number") || 5;
      if (stakes < 5)
        return interaction.reply(
          `You can't rob less than **5** candies <a:exclamation:741988026296696872>`
        );
      if (stakes > 100)
        return interaction.reply(
          "Your Candy sack isn't big enough to rob more than 100 candies <a:exclamation:741988026296696872>"
        );
      if (player.CandyCount < stakes)
        return interaction.reply(
          "You can't try robbing more candies than you have! <a:OhShitLookAtTheTimeWatch:751527814691553280>"
        );
      if (torobplayer.CandyCount < stakes)
        return interaction.reply(
          `They doesn't have that many candies! *Maybe avoid robbing homeless people like him* <a:LmaoBlast:741346535358595072>`
        );
      if (torobplayer.shield > 0) {
        //interaction.reply(`**You tried robbing ${torob.toString()} but they had Candy shield activated!** 🛡️<:gun:745728816915284180>`)
        let candiestaken = 0;
        const takenobj = {};
        while (candiestaken < Math.floor(stakes / 5)) {
          const randomcandy = Object.keys(player.candy).filter(
            (x) =>
              // @ts-ignore
              !player.candy[x] <= 0 &&
              !x.endsWith("stone") &&
              !x.startsWith("$")
          )[
            Math.floor(
              Math.random() *
                Object.keys(player.candy).filter(
                  (x) =>
                    // @ts-ignore
                    !player.candy[x] <= 0 &&
                    !x.endsWith("stone") &&
                    !x.startsWith("$")
                ).length
            )
          ];
          let taken;
          if (
            // @ts-ignore
            player.candy[randomcandy] >=
            Math.floor(stakes / 5) - candiestaken
          )
            taken =
              Math.floor(
                (Math.random() * (Math.floor(stakes / 5) - candiestaken)) / 2
              ) +
              1 +
              Math.floor((Math.floor(stakes / 5) - candiestaken) / 2);
          /* @ts-ignore */ else
            taken = Math.floor(Math.random() * player.candy[randomcandy]) + 1;
          candiestaken += taken;
          // @ts-ignore
          takenobj[randomcandy] = takenobj[randomcandy] + taken || taken;
          // @ts-ignore
          player.candy[randomcandy] = player.candy[randomcandy] - taken;
          player.CandyCount = player.CandyCount - taken;
          // @ts-ignore
          torobplayer.candy[randomcandy] =
            // @ts-ignore
            torobplayer.candy[randomcandy] + taken;
          torobplayer.CandyCount = torobplayer.CandyCount + taken;
        }
        torobplayer.shield = torobplayer.shield - 1;
        await player.save();
        await torobplayer.save();
        let total;
        if (Object.values(takenobj).length < 1) total = 0;
        else
          total = Object.values(takenobj).reduce(
            (arr: any, cur: any) => arr + cur
          );
        const stolenmessage = Object.entries(takenobj)
          .map((x) => `\`${x[0].toUpperCase()}\`` + " - " + `\`${x[1]}\``)
          .join("\n");

        const emb = new MessageEmbed()
          .setColor("WHITE")
          .setTitle(`${torob.username} had Candy shield activated! 🛡️`)
          .setDescription(
            "You ended up losing " +
              `**${total}**` +
              " Candies!\n" +
              stolenmessage
          );

        simped.set(interaction.user.id, Date.now() + 300000);
        setTimeout(() => simped.delete(interaction.user.id), 300000);

        return interaction.reply({ embeds: [emb] });
        //return interaction.reply("You lost " + total + " candies:\n" + stolenmessage)
      }
      /*
if (player.Luck > 50) interaction.reply(`Your luck boost has been activated and your chances of succeeding are now ${player.Luck}%!`)
if (player.Luck < 50) interaction.reply(`Your bad luck is wearing off, but your chances are succeeding are only ${player.Luck}%. 😭`)
*/
      const random = Math.floor(Math.random() * 100);
      if (random < 50) {
        // random < player.Luck
        // win
        let candiestaken = 0;
        const takenobj = {};
        while (candiestaken < stakes) {
          const randomcandy = Object.keys(torobplayer.candy).filter(
            (x) =>
              // @ts-ignore
              !torobplayer.candy[x] <= 0 &&
              !x.endsWith("stone") &&
              !x.startsWith("$")
          )[
            Math.floor(
              Math.random() *
                Object.keys(torobplayer.candy).filter(
                  (x) =>
                    // @ts-ignore
                    !torobplayer.candy[x] <= 0 &&
                    !x.endsWith("stone") &&
                    !x.startsWith("$")
                ).length
            )
          ];
          let taken; // @ts-ignore
          if (torobplayer.candy[randomcandy] >= stakes - candiestaken)
            taken =
              Math.floor((Math.random() * (stakes - candiestaken)) / 2) +
              1 +
              Math.floor((stakes - candiestaken) / 2);
          else
            taken = // @ts-ignore
              Math.floor(Math.random() * torobplayer.candy[randomcandy]) + 1;
          candiestaken += taken;
          // @ts-ignore
          takenobj[randomcandy] = takenobj[randomcandy] + taken || taken;
          // @ts-ignore
          player.candy[randomcandy] = player.candy[randomcandy] + taken;
          // @ts-ignore
          torobplayer.candy[randomcandy] = // @ts-ignore
            torobplayer.candy[randomcandy] - taken;
          player.CandyCount = player.CandyCount + taken;
          torobplayer.CandyCount = torobplayer.CandyCount - taken;
        }
        player.Luck = 50;
        await torobplayer.save();
        await player.save();
        let total;
        if (Object.values(takenobj).length < 1) total = 0;
        else
          total = Object.values(takenobj).reduce(
            (arr: any, cur: any) => arr + cur
          );
        //let stolenmessage = Object.entries(takenobj).map(x => x[0] + " : " + x[1]).join('\n')
        const stolenmessage = Object.entries(takenobj)
          .map((x) => `\`${x[0].toUpperCase()}\`` + " - " + `\`${x[1]}\``)
          .join("\n");

        const emb = new MessageEmbed()
          .setColor("RANDOM")
          .setThumbnail("https://i.imgur.com/pCwBBd0.gif")
          .setTitle(`You successfully robbed ${torob.username} 💰`)
          .setDescription(
            "You ended your candy heist with " +
              `**${total}**` +
              " Candies in your bag!\n" +
              stolenmessage
          );
        interaction.reply({ embeds: [emb] });
        //interaction.reply("You stole " + total + " candies:\n"+stolenmessage)
      } else {
        // lose
        let candiestaken = 0;
        const takenobj = {};
        while (candiestaken < stakes) {
          const randomcandy = Object.keys(player.candy).filter(
            (x) =>
              // @ts-ignore
              !player.candy[x] <= 0 &&
              !x.endsWith("stone") &&
              !x.startsWith("$")
          )[
            Math.floor(
              Math.random() *
                Object.keys(player.candy).filter(
                  (x) =>
                    // @ts-ignore
                    !player.candy[x] <= 0 &&
                    !x.endsWith("stone") &&
                    !x.startsWith("$")
                ).length
            )
          ];
          let taken; // @ts-ignore
          if (player.candy[randomcandy] >= stakes - candiestaken)
            taken =
              Math.floor((Math.random() * (stakes - candiestaken)) / 2) +
              1 +
              Math.floor((stakes - candiestaken) / 2);
          /* @ts-ignore */ else
            taken = Math.floor(Math.random() * player.candy[randomcandy]) + 1;
          candiestaken += taken;
          // @ts-ignore
          takenobj[randomcandy] = takenobj[randomcandy] + taken || taken;
          // @ts-ignore
          player.candy[randomcandy] = player.candy[randomcandy] - taken;
          player.CandyCount = player.CandyCount - taken;
          // @ts-ignore
          torobplayer.candy[randomcandy] =
            // @ts-ignore
            torobplayer.candy[randomcandy] + Math.floor(taken / 5);
          torobplayer.CandyCount =
            torobplayer.CandyCount + Math.floor(taken / 5);
        }
        player.Luck = 50;
        await player.save();
        await torobplayer.save();
        let total;
        if (Object.values(takenobj).length < 1) total = 0;
        else
          total = Object.values(takenobj).reduce(
            (arr: any, cur: any) => arr + cur
          );
        const stolenmessage = Object.entries(takenobj)
          .map((x) => `\`${x[0].toUpperCase()}\`` + " - " + `\`${x[1]}\``)
          .join("\n");

        const emb = new MessageEmbed()
          .setColor("RED")
          .setTitle(`ROBBERY FAILED ‼`)
          .setDescription(
            "<a:PoliceFBI:763491244512378893> Police caught you red-handed and took away a total of " +
              `**${total}**` +
              " Candies❗\n" +
              stolenmessage
          );
        interaction.reply({ embeds: [emb] });
      }
      simped.set(interaction.user.id, Date.now() + 300000);
      setTimeout(() => simped.delete(interaction.user.id), 300000);
    }
  }
}
