import { Listener } from "@sapphire/framework";
import DeltaClient from "../../utilities/classes/DeltaClient";

export class ReadyListener extends Listener {
  public run(client: DeltaClient) {
    client.cluster.send({ ready: true });
  }
}
