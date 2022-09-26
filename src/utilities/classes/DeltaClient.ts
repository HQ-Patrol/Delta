import { SapphireClient } from "@sapphire/framework";
import { ClientOptions } from "discord.js";
import { Client } from "discord-hybrid-sharding";

import * as emojis from "../../constants/emoji";
import * as utils from "../global";
import { error } from "../logger";

import { connect } from "../../database/index";

export default class DeltaClient extends SapphireClient {
  public cluster: Client;

  public e: typeof emojis;
  public utils: typeof utils;
  cooldowns: {
    beg: Map<any, any>;
    poke: Map<any, any>;
    rob: Map<any, any>;
    crime: Map<any, any>;
    cookiegive: Map<any, any>;
    earn: Map<any, any>;
    levels: Map<any, any>;
  };

  constructor(options: ClientOptions) {
    super(options);

    this.cluster = new Client(this);
    this.e = emojis;
    this.utils = utils;

    this.cooldowns = {
      beg: new Map(),
      poke: new Map(),
      rob: new Map(),
      crime: new Map(),
      cookiegive: new Map(),

      earn: new Map(),
      levels: new Map(),
    };

    this.connectToDatabase();
  }

  private async connectToDatabase() {
    // Check if mongodb url is provided
    if (!process.env.MONGODB_URL || process.env.MONGODB_URL.length === 0)
      error("You have not provided a MongoDB Connection URL in your .env!");
    connect(this);
  }
}
