import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";

@ApplyOptions<Command.Options>({
  name: "candyflip",
  description:
    "Gamble any amount of Candy(s), stones, packs! Instant doubling????? Here I come",
})
export class CandyFlipCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addStringOption((option) =>
          option
            .setName("itemname")
            .setDescription("What's the item name?")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription("What's the number?")
            .setRequired(false)
            .setMinValue(1)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    let itemName = (interaction.options.getString("itemname") as string)
      .toLowerCase()
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

    function randomcandies(player: any, stakes: any, stone = false) {
      let candiestaken = 0;
      let takenobj = {} as any;
      while (candiestaken < stakes) {
        let randomcandy = Object.keys(player.candy).filter(
          (x) =>
            player.candy[x] - (takenobj[x] || 0) > 0 &&
            (stone ? x.endsWith("stone") : !x.endsWith("stone")) &&
            !x.startsWith("$")
        )[
          Math.floor(
            Math.random() *
              Object.keys(player.candy).filter(
                (x) =>
                  player.candy[x] - (takenobj[x] || 0) > 0 &&
                  (stone ? x.endsWith("stone") : !x.endsWith("stone")) &&
                  !x.startsWith("$")
              ).length
          )
        ];
        if (!randomcandy) break;
        let taken;
        if (player.candy[randomcandy] >= stakes - candiestaken)
          taken =
            Math.floor((Math.random() * (stakes - candiestaken)) / 2) +
            1 +
            Math.floor((stakes - candiestaken) / 2);
        else taken = Math.floor(Math.random() * player.candy[randomcandy]) + 1;
        while (
          taken >
          player.candy[randomcandy] - (takenobj[randomcandy] || 0)
        ) {
          taken--;
        }
        if (taken === 0) continue;

        while (stakes < candiestaken + taken) {
          taken--;
        }
        candiestaken += taken;

        takenobj[randomcandy] = takenobj[randomcandy] + taken || taken;
      }
      return takenobj;
    }

    let player = await Candy.findOne({ id: interaction.user.id });
    if (!player)
      return interaction.reply(
        `**You haven't started your Candy Land pilgrimage yet** <a:exclamation:741988026296696872>`
      );
    let stakes = interaction.options.getInteger("number") || 1;

    let heads = Math.random() < 0.5;
    if (itemName.toLowerCase() === "random") {
      if (player.CandyCount < stakes)
        return interaction.reply(
          `You can't gamble more than you got yourself 😐<a:exclamation:741988026296696872>`
        );
      let heads = Math.random() < 0.5;
      let candies = Object.entries(randomcandies(player, stakes));
      candies.forEach((candy) => {
        // @ts-ignore
        player.candy[candy[0]] = // @ts-ignore
          player.candy[candy[0]] + (heads ? candy[1] : -candy[1]);
      });
      player.CandyCount = player.CandyCount + (heads ? stakes : -stakes);
      await player.save();
      let stake = candies
        .map((x) => `\`${x[0].toUpperCase()}\`` + " - " + `\`${x[1]}\``)
        .join("\n");
      interaction.reply(
        `just ${
          heads
            ? `**WON** ${stakes} candies! <a:SkeletonDance:762022959841804378>\n${stake}`
            : `**LOST** ${stakes} candies! <a:CleanWoman:728219543658561606>\n${stake}`
        } `
      );
    } else if (["pack", "packs"].includes(itemName.toLowerCase())) {
      if (player.Package < stakes)
        return interaction.reply(
          `You can't gamble more than you got yourself 😐<a:exclamation:741988026296696872>`
        );
      player.Package = player.Package + (heads ? stakes : -stakes);
      await player.save();
      interaction.reply(
        `just ${
          heads
            ? `**WON** ${stakes} packages! <a:SkeletonDance:762022959841804378>`
            : `**LOST** ${stakes} packages! <a:CleanWoman:728219543658561606>`
        } `
      );
    } else if (itemName.toLowerCase() === "stone") {
      if (
        // @ts-ignore
        Object.entries(player.candy)
          .filter((x) => x[0].endsWith("stone"))
          // @ts-ignore
          .reduce((acc, cur) => acc + cur[1]) < stakes
      )
        return interaction.reply("Lel too poor");
      let heads = Math.random() < 0.5;
      let candies = Object.entries(randomcandies(player, stakes, true));
      candies.forEach((candy) => {
        // @ts-ignore
        player.candy[candy[0]] = // @ts-ignore
          player.candy[candy[0]] + (heads ? candy[1] : -candy[1]);
      });
      await player.save();
      interaction.reply(
        `just ${
          heads
            ? `**WON** ${stakes} stones!! <a:ThanosDance:763468378794754049>`
            : `**LOST** ${stakes} stones!! <a:CleanWoman:728219543658561606>`
        } `
      );
    } else if (Object.keys(player.candy).includes(itemName.toLowerCase())) {
      // @ts-ignore
      if (player.candy[itemName.toLowerCase()] < stakes)
        return interaction.reply(
          `You can't gamble more than you got yourself 😐<a:exclamation:741988026296696872>`
        );
      // @ts-ignore
      player.candy[itemName.toLowerCase()] = // @ts-ignore
        player.candy[itemName.toLowerCase()] + (heads ? stakes : -stakes);
      if (!itemName.toLowerCase().endsWith("stone"))
        player.CandyCount = player.CandyCount + (heads ? stakes : -stakes);

      await player.save();
      interaction.reply(
        `just ${
          heads
            ? `**WON** ${stakes} ${itemName.toLowerCase()} <a:SkeletonDance:762022959841804378>`
            : `**LOST** ${stakes} ${itemName.toLowerCase()} <a:CleanWoman:728219543658561606>`
        } `
      );
    } else
      return interaction.reply(
        "__**Usage:**__ `/candyflip <ItemName> <number>`\nChoose between: `Random`, `CandyName`, `StoneName` or `Packs`.`"
      );
  }
}
