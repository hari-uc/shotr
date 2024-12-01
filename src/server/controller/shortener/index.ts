import z from "zod";
import prisma from "../../../config/prisma";
import logger from "../../../utils/logger";
import { responseWrapper } from "../../../utils/resonseWrapper";
import { Request, Response } from "express";
import { generateLinkId } from "../../../utils/generator";
import { createLinkValidation } from "./validation";
import { sendMessageToSQS } from "../../../utils/sqs-helper";
const FRONTEND_URL = process.env.FRONTEND_URL;


async function getTopicId(topic: string, user_id: string): Promise<string> {
    const existingTopic = await prisma.topic.findUnique({
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

    const newTopic = await prisma.topic.create({
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

export const createShortenedLink = async (req: Request, res: Response) => {
    try {
        const [validatedData, linkId] = await Promise.all([
            createLinkValidation.parseAsync(req.body),
            !req.body.customAlias ? generateLinkId() : Promise.resolve(req.body.customAlias)
        ]);

        const { longUrl, topic, customAlias } = validatedData;
        const { user_id } = req.user;

        const topicId = topic ? await getTopicId(topic, user_id) : undefined;

        await prisma.shortenedLink.create({
            data: {
                link_id: linkId,
                long_url: longUrl,
                topic_id: topicId,
                user_id,
                is_custom_alias: !!customAlias
            }
        });

        const shortUrl = `${FRONTEND_URL}/${linkId}`;

        return responseWrapper(res, {
            status: 200,
            message: "Link created successfully",
            success: true,
            data: { shortUrl, createdAt: new Date() }
        });

    } catch (error: any) {
        logger.error(error);

        if (error instanceof z.ZodError) {
            return responseWrapper(res, {
                status: 400,
                message: "Bad request",
                success: false,
                error: error.errors[0]?.message || "Invalid request body"
            });
        }

        if (error.code === "P2002") {
            return responseWrapper(res, {
                status: 400,
                message: "Bad request",
                success: false,
                error: "Link ID already exists"
            });
        }
        if (error.code === "P2003") {
            return responseWrapper(res, {
                status: 404,
                message: "Bad request",
                success: false,
                error: "User/Topic not found"
            });
        }

        return responseWrapper(res, {
            status: 500,
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}


export const redirectAlias = async (req: Request, res: Response) => {
    const { alias } = req.params;
    const link = await prisma.shortenedLink.findUnique({ where: { link_id: alias }, select: { long_url: true } });
    if (!link) return res.redirect(302, `${FRONTEND_URL}/404`);
    const message = JSON.stringify({ ip: req.clientIp, userAgent: req.headers['user-agent'], alias });
    sendMessageToSQS(message);
    return res.redirect(302, link.long_url);
}   