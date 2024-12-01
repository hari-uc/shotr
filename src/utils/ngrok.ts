import { SessionBuilder } from "@ngrok/ngrok";
import logger from "./logger";
const { NGROK_DOMAIN, PORT } = process.env;

async function connectTunnel() {
    try {
        const builder = new SessionBuilder()
            .authtokenFromEnv()
            .clientInfo("ngrok-http-full", "1.2.3")
            .handleStopCommand(() => logger.info("Received stop command"))
            .handleRestartCommand(() => logger.info("Received restart command"))
            .handleUpdateCommand((update) => logger.info(`Received update command, version: ${update.version}, permitMajorVersion: ${update.permitMajorVersion}`))
            .handleHeartbeat((latency) => logger.info(`Heartbeat received, latency: ${latency} milliseconds`))


        const session = await builder.connect();
        const endpoint = session.httpEndpoint().domain(NGROK_DOMAIN as string).requestHeader("ngrok-skip-browser-warning", "1").requestHeader("User-Agent", "Mozilla/5.0").metadata("option orbit");
        const listener = await endpoint.listen();
        logger.debug(`Ngrok session started: ${listener.url()}`);
        listener.forward(`localhost:${PORT || 8080}`);
        logger.debug(`Forwarding traffic to http://localhost:${PORT || 8080}`);
        return listener.url();
    } catch (error: any) {
        logger.error(error.message);

    }
}

export default connectTunnel;