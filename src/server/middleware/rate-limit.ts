import { NextFunction, Request, Response } from "express";
import redis from "../../utils/redisInstance";
import { responseWrapper } from "../../utils/resonseWrapper";
import logger from "../../utils/logger";

export const rateLimitter = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.clientIp;
    const path = req.path;
    const key = `rate_limit:${ip}:${path}`;
    const limit = 10;

    try {
        const count = Number(await redis.get(key)) || 0;

        if (count === 0) {
            await redis.multi()
                .set(key, 1)
                .expire(key, 60) // 60 seconds
                .exec();
        } else {
            if (count >= limit) {
                const ttl = await redis.ttl(key);

                return responseWrapper(res, {
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
            await redis.incr(key);
        }

        const currentCount = Number(await redis.get(key));
        const ttl = await redis.ttl(key);

        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - currentCount));
        res.setHeader('X-RateLimit-Reset', Date.now() + (ttl * 1000));

        next();
    } catch (error) {
        logger.error('Rate limit error:', error);
        next();
    }
};