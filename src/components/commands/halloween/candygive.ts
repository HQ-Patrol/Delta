import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { HalloweenModel as Candy } from "../../../database/models/HalloweenModel";
import humanizeDuration from "humanize-duration";
import config from "../../../config.json";
import { GuildMember, TextChannel } from "discord.js";

const simped = new Map();

@ApplyOptions<Command.Options>({
  name: "candygive",
  description: "Gives any candy to any person you want!",
})
export class CandyGiveCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Choose the user")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("itemname")
            .setDescription("What's the item name?")
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const cooldown = simped.get(interaction.user.id);

    if (
      // @ts-ignore
      !config.sdog.some((x: any) => interaction.member?.roles.cache.has(x)) &&
      // @ts-ignore
      !config.commanders.includes(interaction.user.id)
    ) {
      return interaction
        .reply({
          embeds: [
            {
              image: { url: "https://i.imgur.com/OOGK6z1.gif" },
              color: "RED",
              description:
                "You need to be a __**SUGAR DADDY OF THE GANG**__ to use this feature <a:exclamation:741988026296696872>",
            },
          ],
        })
        .then((m: any) => m.delete({ timeout: 5000 }));
    }

    if (
      interaction.user.id !== "711590556228386917" &&
      interaction.user.id !== "179911663586246656"
    ) {
      let memberz = interaction.options.getMember("member") as GuildMember;
      if (!memberz) {
        if (!cooldown) {
          return interaction
            .reply("You didn't mention the user correctly!")
            .then((m: any) => m.delete({ timeout: 4000 }));
        } else {
          let remaining = humanizeDuration(cooldown - Date.now(), {
            units: ["h", "m", "s"],
            round: true,
          });
          return interaction.reply(
            `${interaction.user}, Wait \`${remaining}\` before using your special powers again! <a:OhShitLookAtTheTimeWatch:751527814691553280>`
          );
        }
      }

      if (memberz.user.id === interaction.user.id) {
        return interaction.reply(
          "https://media1.tenor.com/images/5d81477db332dfe09a30c96d0345f88f/tenor.gif?itemid=14890552"
        );
      }

      if (cooldown) {
        const remaining = humanizeDuration(cooldown - Date.now(), {
          units: ["h", "m", "s"],
          round: true,
        });
        return interaction
          .reply(
            `${interaction.user}, Wait \`${remaining}\` before using your special powers again! <a:OhShitLookAtTheTimeWatch:751527814691553280>`
          )
          .catch(console.error);
      } else {
        let argu = (interaction.options.getString("itemname") as string)
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

        if (!argu)
          return interaction.reply(
            "You didn't specify the candy to give! Check `/CandyList` to see your options :)"
          );

        if (argu.includes("stone") || argu.includes("wonka")) {
          return interaction
            .reply("**❌ FORBIDDEN ❌**")
            .then((m: any) => m.delete({ timeout: 2000 }));
        }

        let candyArr = [
          "candy button",
          "candybutton",
          "candy stick",
          "candystick",
          "mint candy",
          "mintcandy",
          "jolly rancher",
          "jollyrancher",
          "jelly bean",
          "jellybean",
          "gummy bear",
          "gummybear",
          "candy cane",
          "candycane",
          "candy button",
          "candybutton",
          "bubble gum",
          "bubblegum",
          "sour patch",
          "sourpatch",
          "pocky",
          "skittles",
          "caramel",
          "chocolate",
          "bonbon",
          "marshmallow",
          "bubblegum",
          "gumball",
          "jawbreaker",
          "lollipop",
          "toffee",
          "wonka bar",
          "wonkabar",
        ];
        if (!candyArr.includes(argu)) {
          return interaction.reply("That's not a valid Candy type! 😐");
        }

        const res = await Candy.findOne({ id: memberz.id });
        if (!res)
          return interaction.reply(
            `<@${memberz.id}> haven't started their journey to the Candy Land yet!`
          );

        if (argu) {
          await Candy.findOneAndUpdate(
            { id: memberz.id },
            {
              // @ts-ignore
              candy: Object.assign(res.candy, { [argu]: res.candy[argu] + 1 }),
              CandyCount: res.CandyCount + 1,
            }
          );
        }

        simped.set(interaction.user.id, Date.now() + 10800000);
        setTimeout(() => simped.delete(interaction.user.id), 10800000);

        await interaction.reply(
          `${interaction.user} gave **${argu}** to <@${memberz.id}> <a:Candy1:747106214273613824> `
        );
        return (
          interaction.client.channels.cache.get(
            "880072529463627806"
          ) as TextChannel
        ).send(
          `${interaction.user} gave **${argu}** to <@${memberz.id}> <a:Candy1:747106214273613824> in ${interaction.guild} [${interaction.guild?.id}]`
        );
      }
    } else {
      let memberz = interaction.options.getMember("member") as GuildMember;
      if (!memberz) {
        return interaction
          .reply("You didn't mention the user correctly!")
          .then((m: any) => m.delete({ timeout: 4000 }));
      }

      if (memberz.user.id === interaction.user.id) {
        return interaction.reply(
          "https://media1.tenor.com/images/5d81477db332dfe09a30c96d0345f88f/tenor.gif?itemid=14890552"
        );
      }

      let argu = (interaction.options.getString("itemname") as string)
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

      if (!argu)
        return interaction.reply(
          "You didn't specify the candy to give! Check `/CandyList` to see your options :)"
        );

      let candyArr = [
        "candy button",
        "candybutton",
        "candy stick",
        "candystick",
        "mint candy",
        "mintcandy",
        "jolly rancher",
        "jollyrancher",
        "jelly bean",
        "jellybean",
        "gummy bear",
        "gummybear",
        "candy cane",
        "candycane",
        "candy button",
        "candybutton",
        "bubble gum",
        "bubblegum",
        "sour patch",
        "sourpatch",
        "pocky",
        "skittles",
        "caramel",
        "chocolate",
        "bonbon",
        "marshmallow",
        "bubblegum",
        "gumball",
        "jawbreaker",
        "lollipop",
        "toffee",
        "wonka bar",
        "wonkabar",
      ];
      if (!candyArr.includes(argu)) {
        return interaction.reply("That's not a valid Candy type! 😐");
      }

      const res = await Candy.findOne({ id: memberz.id });
      if (!res)
        return interaction.reply(
          `<@${memberz.id}> haven't started their journey to the Candy Land yet!`
        );

      if (argu) {
        await Candy.findOneAndUpdate(
          { id: memberz.id },
          {
            // @ts-ignore
            candy: Object.assign(res.candy, { [argu]: res.candy[argu] + 1 }),
            CandyCount: res.CandyCount + 1,
          }
        );
      }

      await interaction.reply(
        `${interaction.user} gave **${argu}** to <@${memberz.id}> <a:Candy1:747106214273613824> `
      );
      return (
        interaction.client.channels.cache.get(
          "880072529463627806"
        ) as TextChannel
      ).send(
        `${interaction.user} gave **${argu}** to <@${memberz.id}> <a:Candy1:747106214273613824> in ${interaction.guild} [${interaction.guild?.id}]`
      );
    }
  }
}
