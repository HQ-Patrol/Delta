import { SapphireClient } from "@sapphire/framework";
import { ClientOptions, Collection } from "discord.js";
import { Client } from "discord-hybrid-sharding";

import * as emojis from "../../constants/emoji";
import * as utils from "../global";
import { error } from "../logger";

import { connect } from "../../database/index";

export default class DeltaClient extends SapphireClient {
  public commands: Collection<string, unknown>;
  public events: Collection<string, unknown>;
  public cluster: Client;

  public e: typeof emojis;
  public utils: typeof utils;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection();
    this.events = new Collection();
    this.cluster = new Client(this);

    this.e = emojis;
    this.utils = utils;

    this.connectToDatabase();
  }

  private async connectToDatabase() {
    // Check if mongodb url is provided
    if (!process.env.MONGODB_URL || process.env.MONGODB_URL.length === 0)
      error("You have not provided a MongoDB Connection URL in your .env!");
    connect(this);
  }
}
