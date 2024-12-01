import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "../utils/logger";
import router from "./routes";
import workerApp from "../worker/core";
import { ipHandler } from "./middleware/ip-handler";
import { rateLimitter } from "./middleware/rate-limit";
import connectTunnel from "../utils/ngrok";
import swaggerOptions from "../swagger";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.set('trust proxy', true);
app.use(ipHandler);

app.use('/api', rateLimitter, router);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

workerApp.start();

connectTunnel();

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

export default app;
