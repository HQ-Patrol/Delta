const mongoose = require("mongoose");

const UserMonthlyMissionSchema = new mongoose.Schema({
  id: String,
  work_Plumber: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  work_TechSupport: {
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
  marriage: {
    value: Number,
    users: Array,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  marriageStreak: {
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
  use_MysteryBox1: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_MysteryBox2: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_MysteryBoxXXX: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  use_CumChalice: {
    value: Number,
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
  hatch_Furrloin: {
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
  brawl_Chelsea: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  brawl_Gary: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  brawl_Gray: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  evo3_Level15: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  pet_Level25: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  bonk: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  cookie: {
    value: Number,
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
  fart: {
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
  coins: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  negative: {
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
  cfBattle: {
    value: Number,
    users: Array,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  slots: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  rt7: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  trade: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  rr: {
    value: Number,
    wins: Number,
    loss: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  toxic: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  vote: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  tts: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  rep: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  locks: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  snitchDemon: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  rob: {
    value: Number,
    users: Array,
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_BigBaller: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_Hackerman: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_NFT: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  badge_BrawlMaster: {
    prize: Boolean,
    prizePlus: Boolean,
  },
  tax_Benefits: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
  tax_Return: {
    value: Number,
    prize: Boolean,
    prizePlus: Boolean,
  },
});

module.exports = mongoose.model("usermm", UserMonthlyMissionSchema);
