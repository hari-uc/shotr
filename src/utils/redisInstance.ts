import { Redis } from 'ioredis';
import logger from './logger';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

logger.info('Redis connection attempt with:', {
    host: REDIS_HOST,
    port: REDIS_PORT
});


const redis = new Redis({
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT || '6379'),
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('connect', () => {
    logger.info('Successfully connected to Redis');
});

redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

export default redis;