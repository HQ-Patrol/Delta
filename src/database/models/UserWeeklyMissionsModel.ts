import { Schema, model } from "mongoose";

const UserWeeklyMissionSchema = new Schema({
  id: String,
  work_Plumber: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  work_Chef: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  work_GoldDigger: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  work_Teacher: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  daily: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  verify: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  marriage: {
    value: Number,
    users: Array,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  fight: {
    value: Number,
    users: Array,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  snap: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_Handcuffs: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_PrayerRug: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_MysteryBox1: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_Snowball: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_Soft: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_Medium: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_Hard: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  hatch_Sparky: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  hatch_Quaggi: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  hatch_Chimpmunk: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  brawl_total: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  brawl_users: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  brawl_Jordan: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  brawl_Sid: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  brawl_MrWolf: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  evo2_Level10: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  pet_Level20: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  vote: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  bonk: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  cookie: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  cf: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  jackpot: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  jackpotStart: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  rps: {
    value: Number,
    wins: Number,
    loss: Number,
    tie: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  fart: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  dr: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  bj: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  topic: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  riddle1: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  riddle2: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  riddle3: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  riddle4: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  riddle5: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  set: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  groom: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  mv: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  derep: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  coins: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  negative: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  based: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_Admirable: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_HeroofSovietUnion: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_ClaimGuru: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_NFT: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  tax_Return: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
});

export default model("userwm", UserWeeklyMissionSchema);
