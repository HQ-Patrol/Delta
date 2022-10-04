import ms from "ms";
import pretty from "pretty-ms";
import { MessageEmbed } from "discord.js";
import { ChatInputCommand, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

import { MOTWModel } from "../../../database/models/MOTWModel";
import { SOTWModel } from "../../../database/models/SOTWModel";
import { RepModel } from "../../../database/models/RepModel";
import { Economy } from "../../../database/models/EconomyModel";
import { BadgesModel } from "../../../database/models/BadgesModel";
import { MarriageModel } from "../../../database/models/MarriageModel";
import { AvatarModel } from "../../../database/models/AvatarModel";
import { User } from "../../../database/models/UserModel";
import { getSelectedPet } from "../../../utilities/query/pets";
import findUserById from "../../../database/functions/economy/findUserById";

import { nextExpRequirement, symbol } from "../../../utilities/query/economy";
import sendError from "../../../utilities/sendError";
import { resolve, check } from "../../../utilities/badges";

function xpBar(arg1: number, arg2: number) {
  if (!arg1 || !arg2) return "□".repeat(10);
  const num = Math.floor((arg1 / arg2) * 10);

  let res = "";
  res += "■".repeat(num);
  if (arg1 > 1110000) {
    res = "**𝗠𝗔𝗫𝗘𝗗**";
  } else {
    res += "□".repeat(10 - num);
  }
  return res;
}

let cachedUsers: Record<string, string | number | null> = {
  repTop: null,
  modTop: null,
  simpTop: null,
  coinsTop: null,
  xpTop: null,

  lastUpdated: -1,
  refresh: ms("30m"),
};

const ChampionBadge = resolve("Champion")!.badge;
const MachineBadge = resolve("Money Machine")!.badge;
const ModBadge = resolve("Global Best Mod")!.badge;
const SimpBadge = resolve("Global Simp King")!.badge;
const RepBadge = resolve("Global Reps Boss")!.badge;
const MarriedBadge = "<:Married:777103441746722837>";

@ApplyOptions<Command.Options>({
  name: "profile",
  description: "Fetch yours or another users Patrol Bot profile.",
})
export class ProfileCommand extends Command {
  public registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .setDMPermission(false)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Who's profile would you like to see?")
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const { client } = this.container;

    const user = interaction.options.getUser("user") || interaction.user;
    if (user.bot)
      return sendError(interaction, "You can't view profiles of bots!");
    if (user) await check(user.id);

    // populate cache when needed
    if (Date.now() > (cachedUsers.lastUpdated as number) + (cachedUsers.refresh as number)) {
      // gotta "any" type this because of some stupid leandocument error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [repTop, modTop, simpTop, coinsTop, xpTop]: Array<any> =
        await Promise.all([
          RepModel.find().sort({ rep: -1 }).limit(1).lean(),
          MOTWModel.find().sort({ modV: -1 }).limit(1).lean(),
          SOTWModel.find().sort({ simpV: -1 }).limit(1).lean(),
          Economy.find().sort({ bank: -1 }).limit(1).lean(),
          Economy.find().sort({ xp: -1 }).limit(1).lean(),
        ]);

        cachedUsers = {
          repTop: repTop.userID,
          modTop: modTop.userID,
          simpTop: simpTop.userID,
          coinsTop: coinsTop.id,
          xpTop: xpTop.id,
          
          lastUpdated: Date.now(),
          refresh: ms("30m"),
        };
    }

    const [economy, marriage, avatar, userInfo, rep, selected, badges] = await Promise.all([
      findUserById(user.id),
      MarriageModel.findOne({ id: user.id }).lean(),
      AvatarModel.findOne({ userID: user.id }).lean(),
      User.findOne({ _id: user.id }).lean(),
      RepModel.findOne({ userID: user.id }).lean(),
      getSelectedPet(user.id),
      BadgesModel.findOne({ id: user.id }).lean()
    ]);
    const xpReq = nextExpRequirement(economy.xp);
    const [roman, taxDescription] = symbol(economy.bracket);

    const badgesArray: string[] = badges?.badges?.map((b) => b.badge) || [];

    let verifiedStatus = "- ᴜɴᴠᴇʀɪꜰɪᴇᴅ - [[?]](https://imgur.com/a/9CZ9qKp)";
    if(userInfo?.certified && !userInfo?.verified) verifiedStatus = "Certified (18-) ✅";
    else if(userInfo?.verified && !userInfo?.certified) verifiedStatus = "Verified (18+) ✅";

    // add extra badges
    if (cachedUsers.repTop === user.id) badgesArray.push(RepBadge);
    if (cachedUsers.modTop === user.id) badgesArray.push(ModBadge);
    if (cachedUsers.simpTop === user.id) badgesArray.push(SimpBadge);
    if (cachedUsers.coinsTop === user.id) badgesArray.push(MachineBadge);
    if (cachedUsers.xpTop === user.id) badgesArray.push(ChampionBadge);
    if (marriage?.spouse) badgesArray.push(MarriedBadge);
    
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setFooter({ text: `${user.id}` })
      .setTimestamp()
      .setAuthor({
        name: `${user.tag}'s Profile!`,
        iconURL: (
          userInfo?.verified ? "https://i.imgur.com/Pp28QSL.gif" : (userInfo?.certified ? "https://i.imgur.com/jUsmDon.gif" : "https://i.imgur.com/DLSoUkv.png")
        )
      })
      .setThumbnail(
        user.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        })
      )
      .setDescription(avatar?.description || "*No set description =(*")
      .addFields(
        {
          name: `⚡ __Level__: ${economy.level} ${selected?.sprite || "<a:Sparklez:944978738628661268>"}`,
          value: `(${economy.xp}/${xpReq}xp) [${xpBar(economy.xp, xpReq)}]`
        },
        {
          name: `💰 __Net Wealth__: ${economy.coins + economy.bank} <a:Coins:775714101564276756>`,
          value: `**<:Wallet:775651665553915904> Wallet:** ${economy.coins} **|** 🏧 **Bank:** ${economy.bank}\n<:Tax:901856256803885076> **Tax Bracket:** ${roman} **|** ${taxDescription}`
        },
        {
          name: "💍 __Married to__:",
          value: marriage?.spouse
            ? `${client.users.cache.get(marriage.spouse)?.tag || `<@${marriage.spouse}>`} 💞 <:WavyDash:760469258093723689> \`Since: ${pretty(Date.now() - parseInt(marriage.time))}\`` 
            : "- ɴᴏʙᴏᴅʏ -"
        },
        {
          name: "👥 __Verification:__",
          value: verifiedStatus,
          inline: true,
        },
        {
          name: "🌟 __Premium Status:__",
          value:
            !userInfo?.premium
              ? "Off <:offline:730144283692105779>"
              : "On <:online:730144283520270417>",
          inline: true,
        },
        {
          name: "<a:Decrease:943232879641645056> __Social Credits:__",
          value: rep ? `\`\`\`${rep.rep} [${rep.repW}]\`\`\``: "None",
          inline: true,
        },
        {
          name: "🏆 __Badges__",
          value: !badgesArray || badgesArray.length === 0 ? "*-No Badges-*" : badgesArray.join(" ")
        }
      );

    return interaction.reply({
      embeds: [embed],
    });
  }
}
