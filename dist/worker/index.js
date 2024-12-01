"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const core_1 = __importDefault(require("./core"));
core_1.default.on("error", (err) => {
    logger_1.default.error(err);
});
core_1.default.on("processing_error", (err) => {
    logger_1.default.error(err.message);
});
core_1.default.on("timeout_error", (err) => {
    logger_1.default.error(err.message);
});
core_1.default.on("started", () => {
    logger_1.default.info("Worker started");
});
