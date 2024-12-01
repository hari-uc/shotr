"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitter = void 0;
const redisInstance_1 = __importDefault(require("../../utils/redisInstance"));
const resonseWrapper_1 = require("../../utils/resonseWrapper");
const logger_1 = __importDefault(require("../../utils/logger"));
const rateLimitter = async (req, res, next) => {
    const ip = req.clientIp;
    const path = req.path;
    const key = `rate_limit:${ip}:${path}`;
    const limit = 10;
    try {
        const count = Number(await redisInstance_1.default.get(key)) || 0;
        if (count === 0) {
            await redisInstance_1.default.multi()
                .set(key, 1)
                .expire(key, 60) // 60 seconds
                .exec();
        }
        else {
            if (count >= limit) {
                const ttl = await redisInstance_1.default.ttl(key);
                return (0, resonseWrapper_1.responseWrapper)(res, {
                    error: 'Rate limit exceeded',
                    status: 429,
                    success: false,
                    data: {
                        retryAfter: ttl,
                        limit: limit,
                        remaining: 0,
                        resetIn: `${ttl} seconds`
                    }
                });
            }
            await redisInstance_1.default.incr(key);
        }
        const currentCount = Number(await redisInstance_1.default.get(key));
        const ttl = await redisInstance_1.default.ttl(key);
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - currentCount));
        res.setHeader('X-RateLimit-Reset', Date.now() + (ttl * 1000));
        next();
    }
    catch (error) {
        logger_1.default.error('Rate limit error:', error);
        next();
    }
};
exports.rateLimitter = rateLimitter;
