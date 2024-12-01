require('dotenv').config();
import express from "express";
import cors from "cors";
import logger from "../utils/logger";
import router from "./routes";
import workerApp from "../worker/core";
import { ipHandler } from "./middleware/ip-handler";

const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.set('trust proxy', true);
app.use(ipHandler);

app.use('/api', router);

workerApp.start();

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

export default app;
