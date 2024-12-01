"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipHandler = void 0;
const request_ip_1 = require("request-ip");
const logger_1 = __importDefault(require("../../utils/logger"));
const ipHandler = (req, res, next) => {
    req.clientIp = (0, request_ip_1.getClientIp)(req) || null;
    logger_1.default.info(`IP: ${req.clientIp} - ${req.originalUrl}`);
    next();
};
exports.ipHandler = ipHandler;
