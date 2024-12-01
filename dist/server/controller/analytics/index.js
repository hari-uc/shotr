"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsByAlias = exports.getAnalyticsByTopic = exports.getOverAllAnalytics = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const logger_1 = __importDefault(require("../../../utils/logger"));
const resonseWrapper_1 = require("../../../utils/resonseWrapper");
const getOverAllAnalytics = async (req, res) => {
    try {
        const { user_id } = req.user;
        const userLinks = await prisma_1.default.shortenedLink.findMany({
            where: { user_id },
            select: { link_id: true }
        });
        if (!userLinks.length) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 200,
                message: "No analytics available",
                success: true,
                data: {
                    totalUrls: 0,
                    totalClicks: 0,
                    uniqueClicks: 0,
                    clicksByDate: [],
                    osType: [],
                    deviceType: []
                }
            });
        }
        const linkIds = userLinks.map(link => link.link_id);
        const [totalClicks, uniqueClicks, clicksByDate, osType, deviceType] = await Promise.all([
            prisma_1.default.clickEvent.count({
                where: { link_id: { in: linkIds } }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["ip"],
                _count: { event_id: true },
                where: { link_id: { in: linkIds } }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["date"],
                _count: { event_id: true },
                where: { link_id: { in: linkIds } },
                orderBy: { date: "desc" },
                take: 10
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["os"],
                _count: { event_id: true },
                where: { link_id: { in: linkIds } }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["device_type"],
                _count: { event_id: true },
                where: { link_id: { in: linkIds } }
            })
        ]);
        const response = {
            totalUrls: userLinks.length,
            totalClicks,
            uniqueClicks: uniqueClicks.length,
            clicksByDate: clicksByDate.map(date => ({
                date: date.date,
                totalClicks: date._count.event_id
            })),
            osType: osType.map(os => ({
                osName: os.os,
                uniqueClicks: os._count.event_id,
                uniqueUsers: os._count.event_id
            })),
            deviceType: deviceType.map(device => ({
                deviceName: device.device_type,
                uniqueClicks: device._count.event_id,
                uniqueUsers: device._count.event_id
            }))
        };
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 200,
            message: "Analytics fetched successfully",
            success: true,
            data: response
        });
    }
    catch (error) {
        logger_1.default.error("Error in getOverAllAnalytics:", error);
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 500,
            message: "Internal server error",
            success: false
        });
    }
};
exports.getOverAllAnalytics = getOverAllAnalytics;
const getAnalyticsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { user_id } = req.user;
        if (!topicId) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 400,
                message: "Topic ID is required",
                success: false
            });
        }
        const topic = await prisma_1.default.topic.findUnique({
            where: { topic_id: topicId, user_id },
            include: {
                shortenedLinks: {
                    select: { link_id: true }
                }
            }
        });
        if (!topic) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 404,
                message: "Topic not found",
                success: false
            });
        }
        const linkIds = topic.shortenedLinks.map(link => link.link_id);
        if (!linkIds.length) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 200,
                message: "No analytics available for this topic",
                success: true,
                data: {
                    totalClicks: 0,
                    uniqueClicks: 0,
                    clicksByDate: [],
                    urls: []
                }
            });
        }
        const [totalClicks, uniqueClicks, clicksByDate, clicksByLink] = await Promise.all([
            prisma_1.default.clickEvent.count({
                where: { link_id: { in: linkIds } }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["ip"],
                _count: { event_id: true },
                where: { link_id: { in: linkIds } }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["date"],
                _count: { event_id: true },
                where: { link_id: { in: linkIds } },
                orderBy: { date: "desc" },
                take: 10
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["link_id"],
                _count: { event_id: true },
                where: { link_id: { in: linkIds } }
            })
        ]);
        const response = {
            totalClicks,
            uniqueClicks: uniqueClicks.length,
            clicksByDate: clicksByDate.map(date => ({
                date: date.date,
                totalClicks: date._count.event_id
            })),
            urls: topic.shortenedLinks.map(link => ({
                shortUrl: link.link_id,
                totalClicks: clicksByLink.find(click => click.link_id === link.link_id)?._count.event_id || 0
            }))
        };
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 200,
            message: "Analytics fetched successfully",
            success: true,
            data: response
        });
    }
    catch (error) {
        logger_1.default.error("Error in getAnalyticsByTopic:", error);
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 500,
            message: "Internal server error",
            success: false
        });
    }
};
exports.getAnalyticsByTopic = getAnalyticsByTopic;
const getAnalyticsByAlias = async (req, res) => {
    try {
        const { alias } = req.params;
        const { user_id } = req.user;
        if (!alias) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 400,
                message: "Alias is required",
                success: false
            });
        }
        const link = await prisma_1.default.shortenedLink.findUnique({
            where: { link_id: alias, user_id }
        });
        if (!link) {
            return (0, resonseWrapper_1.responseWrapper)(res, {
                status: 404,
                message: "Link not found",
                success: false
            });
        }
        const [totalClicks, uniqueClicks, clicksByDate, osType, deviceType] = await Promise.all([
            prisma_1.default.clickEvent.count({
                where: { link_id: alias }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["ip"],
                _count: { event_id: true },
                where: { link_id: alias }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["date"],
                _count: { event_id: true },
                where: { link_id: alias },
                orderBy: { date: "desc" },
                take: 7
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["os"],
                _count: { event_id: true },
                where: { link_id: alias }
            }),
            prisma_1.default.clickEvent.groupBy({
                by: ["device_type"],
                _count: { event_id: true },
                where: { link_id: alias }
            })
        ]);
        const response = {
            totalClicks,
            uniqueClicks: uniqueClicks.length,
            clicksByDate: clicksByDate.map(date => ({
                date: date.date,
                totalClicks: date._count.event_id
            })),
            osType: osType.map(os => ({
                osName: os.os,
                uniqueClicks: os._count.event_id,
                uniqueUsers: os._count.event_id
            })),
            deviceType: deviceType.map(device => ({
                deviceName: device.device_type,
                uniqueClicks: device._count.event_id,
                uniqueUsers: device._count.event_id
            }))
        };
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 200,
            message: "Analytics fetched successfully",
            success: true,
            data: response
        });
    }
    catch (error) {
        logger_1.default.error("Error in getAnalyticsByAlias:", error);
        return (0, resonseWrapper_1.responseWrapper)(res, {
            status: 500,
            message: "Internal server error",
            success: false
        });
    }
};
exports.getAnalyticsByAlias = getAnalyticsByAlias;
