import { Schema, model } from "mongoose";

export interface IUserMonthlyMission {
  id: string;
  work_Plumber: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  work_TechSupport: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  work_GoldDigger: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  work_Teacher: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  daily: {
    prize: boolean;
    prizePlus: boolean;
  };
  marriage: {
    value: number;
    users: string[];
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  marriageStreak: {
    prize: boolean;
    prizePlus: boolean;
  };
  fight: {
    value: number;
    users: string[];
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  snap: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  dr: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  bj: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_MysteryBox1: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_MysteryBox2: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_MysteryBoxXXX: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_CumChalice: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_Soft: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_Medium: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_Hard: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  hatch_Sparky: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  hatch_Quaggi: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  hatch_Chimpmunk: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  hatch_Furrloin: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  brawl_total: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  brawl_users: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  brawl_Chelsea: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  brawl_Gary: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  brawl_Gray: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  evo3_Level15: {
    prize: boolean;
    prizePlus: boolean;
  };
  pet_Level25: {
    prize: boolean;
    prizePlus: boolean;
  };
  bonk: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  cookie: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  jackpot: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  jackpotStart: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  fart: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  topic: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  riddle1: {
    prize: boolean;
    prizePlus: boolean;
  };
  riddle2: {
    prize: boolean;
    prizePlus: boolean;
  };
  riddle3: {
    prize: boolean;
    prizePlus: boolean;
  };
  riddle4: {
    prize: boolean;
    prizePlus: boolean;
  };
  riddle5: {
    prize: boolean;
    prizePlus: boolean;
  };
  coins: {
    prize: boolean;
    prizePlus: boolean;
  };
  negative: {
    prize: boolean;
    prizePlus: boolean;
  };
  cf: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  cfBattle: {
    value: number;
    users: string[];
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  slots: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  rt7: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  trade: {
    value: number;
    users: string[];
    prize: boolean;
    prizePlus: boolean;
  };
  rr: {
    value: number;
    wins: number;
    loss: number;
    prize: boolean;
    prizePlus: boolean;
  };
  toxic: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  vote: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  tts: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  rep: {
    value: number;
    users: string[];
    prize: boolean;
    prizePlus: boolean;
  };
  locks: {
    prize: boolean;
    prizePlus: boolean;
  };
  snitchDemon: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  rob: {
    value: number;
    users: string[];
    prize: boolean;
    prizePlus: boolean;
  };
  badge_BigBaller: {
    prize: boolean;
    prizePlus: boolean;
  };
  badge_Hackerman: {
    prize: boolean;
    prizePlus: boolean;
  };
  badge_NFT: {
    prize: boolean;
    prizePlus: boolean;
  };
  badge_BrawlMaster: {
    prize: boolean;
    prizePlus: boolean;
  };
  tax_Benefits: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  tax_Return: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
}

const UserMonthlyMissionSchema = new Schema<IUserMonthlyMission>({
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

export default model<IUserMonthlyMission>("usermm", UserMonthlyMissionSchema);
