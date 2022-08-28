/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { EconomyModel, IEconomy } from "../../../database/models/EconomyModel";

import emojis from "../../../constants/emoji";
import DeltaClient from "../../../utilities/classes/DeltaClient";
import ComponentMenu from "../../../utilities/classes/ComponentMenu";

interface ILeaderboardUser {
  tag: string;
  data: number;
}

const placements: Record<number, string> = {
  1: "👑",
  2: "🥈",
  3: "🥉",
};

const locale: Record<string, string> = {
  xp: "XP",
  coins: "Coins",
  bank: "Bank",
};

const globalHeaders: Record<string, string> = {
  xp: "Global XP Leaderboard 💫",
  coins: "Global Money Leaderboard 💲",
};

const CACHE_LIMIT = 10;

function generateInteractions(mode: string, global: boolean) {
  let buttons = null;
  // add global/guild buttons
  if (mode !== "bank") {
    buttons = new MessageActionRow().setComponents(
      new MessageButton()
        .setLabel("Guild")
        .setEmoji("⚔️")
        .setStyle("SUCCESS")
        .setCustomId("guild")
        .setDisabled(global === false),
      new MessageButton()
        .setLabel("Global")
        .setCustomId("global")
        .setStyle("SUCCESS")
        .setEmoji("🌏")
        .setDisabled(global === true)
    );
  }

  // add select menu
  const selectMenu = new MessageActionRow().setComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Filter")
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions(
        {
          label: "XP",
          description: "Sort for the XP leaderboard",
          emoji: "💫",
          default: mode === "xp",
          value: "xp",
        },
        {
          label: "Coins",
          description: "Sort for the Coins leaderboard",
          emoji: emojis.coins,
          default: mode === "coins",
          value: "coins",
        },
        {
          label: "Bank",
          description: "Sort for the Bank leaderboard",
          emoji: "🏦",
          default: mode === "bank",
          value: "bank",
        }
      )
  );
  if (buttons) return [buttons, selectMenu];
  return [selectMenu];
}

async function generateUsers(
  client: DeltaClient,
  cache: Record<string, ILeaderboardUser[]>,
  mode: string,
  global: boolean,
  data: any,
  usersInGuild: Array<string>
) {
  const CACHE_KEY = `${mode}_${global ? "global" : "guild"}`;
  if (!cache[CACHE_KEY]) {
    if (global) {
      cache[CACHE_KEY] = await Promise.all(
        data
          .sort((a: any, b: any) => (b as any)[mode] - (a as any)[mode])
          .slice(0, CACHE_LIMIT)
          .map(async (a: IEconomy) => ({
            tag: (await client.users.fetch(a.id)).tag,
            data: (a as any)[mode],
          }))
      );
    } else {
      cache[CACHE_KEY] = await Promise.all(
        data
          .filter((a: IEconomy) => usersInGuild.includes(a.id))
          .sort((a: any, b: any) => b[mode] - a[mode])
          .slice(0, CACHE_LIMIT)
          .map(async (a: IEconomy) => ({
            tag: (await client.users.fetch(a.id)).tag,
            data: (a as any)[mode],
          }))
      );
    }
  }
}

@ApplyOptions<Command.Options>({
  name: "leaderboard",
  description: "Display whos the richest!",
})
export class LeaderboardCommand extends Command {
  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("leaderboard")
        .setDescription("Display whos the richest!")
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if(!interaction.guild) return;
    const { client } = this.container;

    // TODO: Implement custom leaderboard caching, preferably using redis
    const loading = interaction.reply({
      content: "<a:Loading:727148666837663765> Generating the leaderboards....",
      fetchReply: true,
    });

    const all = await EconomyModel.find().lean();

    // generation
    let menu: ComponentMenu;
    let global = false; // defaults to guild
    let mode = "coins"; // defaults to coins

    const guildIDs = [...interaction.guild.members.cache.keys()];
    const cache: Record<string, ILeaderboardUser[]> = {};

    // generate init users
    await generateUsers(client as DeltaClient, cache, mode, global, all, guildIDs);

    const embed = () => {
      const iconURL = global ? "https://i.imgur.com/fUzPD0f.gif" : (interaction.guild?.iconURL() ?? undefined);
      const name = global ? globalHeaders[mode] : `${interaction.guild?.name}'s ${locale[mode]} leaderboard!`;
      const defaultEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(
          { iconURL, name }
        );
      let field1 = "";
      let field2 = "";
      const data = cache[`${mode}_${global ? "global" : "guild"}`];

      for (let i = 0; i < data.length; i += 1) {
        if (i < 5) {
          field1 += `${i < 3 ? placements[i + 1] : `\`#${i + 1}\``} **${
            data[i].tag
          }** ${emojis.wavyDash} ${data[i].data}\n`;
        } else {
          field2 += `${`\`#${i + 1}\``} **${data[i].tag}** ${emojis.wavyDash} ${
            data[i].data
          }\n`;
        }
      }
      defaultEmbed.addFields({
        name: "𝐓𝐎𝐏 𝟏𝟎",
        value: field1,
        inline: true,
      });
      if (field2.length >= 1) {
        defaultEmbed.addFields({
          name: "\u200b",
          value: field2,
          inline: true,
        });
      }
      return defaultEmbed;
    };

    const handler = async (int: ButtonInteraction | SelectMenuInteraction) => {
      int.deferUpdate();
      const id = int.customId;

      if(int instanceof SelectMenuInteraction) {
        mode = ["coins", "xp", "bank"].includes(int.values?.[0])
          ? int.values[0]
          : mode;
      }

      // global & guild
      global = id === "global";

      await generateUsers(client as DeltaClient, cache, mode, global, all, guildIDs);

      menu.embed = embed();
      menu.components = generateInteractions(mode, global);
      return menu.update();
    };

    loading.then(
      (msg: any) => {
        // create a new menu
        menu = new ComponentMenu(interaction)
          .whitelist(interaction.user.id)
          .listen(handler)
          .setEmbed(embed())
          .setComponents(generateInteractions(mode, global));

        menu.menuMessage = msg;
        return menu.send();
      }
    );
  }
}
