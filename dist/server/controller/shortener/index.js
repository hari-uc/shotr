"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectAlias = exports.createShortenedLink = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = __importDefault(require("../../../config/prisma"));
const logger_1 = __importDefault(require("../../../utils/logger"));
const resonseWrapper_1 = require("../../../utils/resonseWrapper");
const generator_1 = require("../../../utils/generator");
const validation_1 = require("./validation");
const sqs_helper_1 = require("../../../utils/sqs-helper");
const redisInstance_1 = __importDefault(require("../../../utils/redisInstance"));
const FRONTEND_URL = process.env.FRONTEND_URL;
const CACHE_TTL = 300; // 5 minutes
async function getTopicId(topic, user_id) {
    const existingTopic = await prisma_1.default.topic.findUnique({
        where: {
            topic_user_id: {
                name: topic,
                user_id
            }
        },
        select: {
            topic_id: true
        }
    });
    if (existingTopic) {
        return existingTopic.topic_id;
    }
    const newTopic = await prisma_1.default.topic.create({
        data: {
            name: topic,
            user_id
        },
        select: {
            topic_id: true
        }
    });
    return newTopic.topic_id;
}
const createShortenedLink = async (req, res) => {
    try {
        const [validatedData, linkId] = await Promise.all([
            validation_1.createLinkValidation.parseAsync(req.body),
            !req.body.customAlias ? (0, generator_1.generateLinkId)() : Promise.resolve(req.body.customAlias)
        ]);
        const { longUrl, topic, customAlias } = validatedData;
        const { user_id } = req.user;
        const cachedLink = await redisInstance_1.default.get(`L:${linkId}`);
        if (cachedLink) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 400,
                message: "Please use a different alias",
                success: false,
                error: "Alias already exists"
            });
        }
        const topicId = topic ? await getTopicId(topic, user_id) : undefined;
        await prisma_1.default.shortenedLink.create({
            data: {
                link_id: linkId,
                long_url: longUrl,
                topic_id: topicId,
                user_id,
                is_custom_alias: !!customAlias
            }
        });
        const shortUrl = `${FRONTEND_URL}/${linkId}`;
        await redisInstance_1.default.set(`L:${linkId}`, shortUrl, 'EX', CACHE_TTL);
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 200,
            message: "Link created successfully",
            success: true,
            data: { shortUrl, createdAt: new Date() }
        });
    }
    catch (error) {
        logger_1.default.error(error);
        if (error instanceof zod_1.default.ZodError) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 400,
                message: "Bad request",
                success: false,
                error: error.errors[0]?.message || "Invalid request body"
            });
        }
        if (error.code === "P2002") {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 400,
                message: "Please use a different alias",
                success: false,
                error: "Alias already exists"
            });
        }
        if (error.code === "P2003") {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 404,
                message: "Bad request",
                success: false,
                error: "User/Topic not found"
            });
        }
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 500,
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};
exports.createShortenedLink = createShortenedLink;
const redirectAlias = async (req, res) => {
    const { alias } = req.params;
    try {
        const cachedUrl = await redisInstance_1.default.get(`R:${alias}`);
        console.log(cachedUrl, "===");
        if (cachedUrl) {
            await recordAnalytics(req, alias);
            return res.redirect(302, cachedUrl);
        }
        const link = await prisma_1.default.shortenedLink.findUnique({
            where: { link_id: alias },
            select: { long_url: true }
        });
        if (!link) {
            return res.redirect(302, `${FRONTEND_URL}/404`);
        }
        console.log(link.long_url);
        await redisInstance_1.default.set(`R:${alias}`, link.long_url, 'EX', CACHE_TTL);
        await recordAnalytics(req, alias);
        return res.redirect(302, link.long_url);
    }
    catch (error) {
        logger_1.default.error('Redirect error:', error);
        return res.redirect(302, `${FRONTEND_URL}/404`);
    }
};
exports.redirectAlias = redirectAlias;
async function recordAnalytics(req, alias) {
    const data = {
        ip: req.clientIp,
        userAgent: req.headers['user-agent'],
        alias,
        timestamp: Date.now()
    };
    try {
        await (0, sqs_helper_1.sendMessageToSQS)(JSON.stringify(data));
    }
    catch (error) {
        logger_1.default.error('Analytics error:', error);
    }
}
