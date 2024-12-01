"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ngrok_1 = require("@ngrok/ngrok");
const logger_1 = __importDefault(require("./logger"));
const { NGROK_DOMAIN, PORT } = process.env;
async function connectTunnel() {
    try {
        const builder = new ngrok_1.SessionBuilder()
            .authtokenFromEnv()
            .clientInfo("ngrok-http-full", "1.2.3")
            .handleStopCommand(() => logger_1.default.info("Received stop command"))
            .handleRestartCommand(() => logger_1.default.info("Received restart command"))
            .handleUpdateCommand((update) => logger_1.default.info(`Received update command, version: ${update.version}, permitMajorVersion: ${update.permitMajorVersion}`))
            .handleHeartbeat((latency) => logger_1.default.info(`Heartbeat received, latency: ${latency} milliseconds`));
        const session = await builder.connect();
        const endpoint = session.httpEndpoint().domain(NGROK_DOMAIN).requestHeader("ngrok-skip-browser-warning", "1").requestHeader("User-Agent", "Mozilla/5.0").metadata("option orbit");
        const listener = await endpoint.listen();
        logger_1.default.debug(`Ngrok session started: ${listener.url()}`);
        listener.forward(`localhost:${PORT || 8080}`);
        logger_1.default.debug(`Forwarding traffic to http://localhost:${PORT || 8080}`);
        return listener.url();
    }
    catch (error) {
        logger_1.default.error(error.message);
    }
}
exports.default = connectTunnel;
