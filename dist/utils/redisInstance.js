"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const logger_1 = __importDefault(require("./logger"));
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
logger_1.default.info('Redis connection attempt with:', {
    host: REDIS_HOST,
    port: REDIS_PORT
});
const redis = new ioredis_1.Redis({
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT || '6379'),
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});
redis.on('connect', () => {
    logger_1.default.info('Successfully connected to Redis');
});
redis.on('error', (err) => {
    logger_1.default.error('Redis connection error:', err);
});
exports.default = redis;
