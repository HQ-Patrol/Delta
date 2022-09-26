import { Schema, model } from "mongoose";

export interface IUserWeeklyMission {
  id: string;
  work_Plumber: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  work_Chef: {
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
  verify: {
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
  use_Handcuffs: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_PrayerRug: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_MysteryBox1: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  use_Snowball: {
    value: number;
    users: string[];
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
  brawl_Jordan: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  brawl_Sid: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  brawl_MrWolf: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  evo2_Level10: {
    prize: boolean;
    prizePlus: boolean;
  };
  pet_Level20: {
    prize: boolean;
    prizePlus: boolean;
  };
  vote: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  bonk: {
    value: number;
    users: string[];
    prize: boolean;
    prizePlus: boolean;
  };
  cookie: {
    value: number;
    users: string[];
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
  rps: {
    value: number;
    wins: number;
    loss: number;
    tie: number;
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
  set: {
    prize: boolean;
    prizePlus: boolean;
  };
  groom: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  mv: {
    value: number;
    users: string[];
    prize: boolean;
    prizePlus: boolean;
  };
  derep: {
    value: number;
    users: string[];
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
  based: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
  badge_Admirable: {
    prize: boolean;
    prizePlus: boolean;
  };
  badge_HeroofSovietUnion: {
    prize: boolean;
    prizePlus: boolean;
  };
  badge_ClaimGuru: {
    prize: boolean;
    prizePlus: boolean;
  };
  badge_NFT: {
    prize: boolean;
    prizePlus: boolean;
  };
  tax_Return: {
    value: number;
    prize: boolean;
    prizePlus: boolean;
  };
}

const UserWeeklyMissionSchema = new Schema<IUserWeeklyMission>({
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

export default model<IUserWeeklyMission>("userwm", UserWeeklyMissionSchema);
