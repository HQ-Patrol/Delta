"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyListener = void 0;
const framework_1 = require("@sapphire/framework");
class ReadyListener extends framework_1.Listener {
    run(client) {
        client.cluster.send({ ready: true });
    }
}
exports.ReadyListener = ReadyListener;
