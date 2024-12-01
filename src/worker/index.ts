import logger from "../utils/logger";
import app from "./core";

app.on("error", (err) => {
    logger.error(err);
})

app.on("processing_error", (err) => {
    logger.error(err.message);
});

app.on("timeout_error", (err) => {
    logger.error(err.message);
});

app.on("started", () => {
    logger.info("Worker started");
})