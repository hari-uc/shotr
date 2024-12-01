"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const prisma_1 = __importDefault(require("../config/prisma"));
const constants_1 = require("./constants");
const agent = supertest_1.default.agent(server_1.default);
describe("Analytics Controller", () => {
    const mockLinkId = "test-link";
    const mockTopicId = "test-topic";
    const mockUserId = "test-user";
    beforeEach(async () => {
        await prisma_1.default.$transaction([
            prisma_1.default.clickEvent.deleteMany(),
            prisma_1.default.shortenedLink.deleteMany(),
            prisma_1.default.topic.deleteMany(),
        ]);
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
    describe("GET /api/analytics", () => {
        it("should return empty analytics when user has no links", async () => {
            const response = await agent
                .get("/api/analytics")
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual({
                totalUrls: 0,
                totalClicks: 0,
                uniqueClicks: 0,
                clicksByDate: [],
                osType: [],
                deviceType: []
            });
        });
        it("should return analytics data for user's links", async () => {
            // Create test data
            await prisma_1.default.shortenedLink.create({
                data: {
                    link_id: mockLinkId,
                    user_id: mockUserId,
                    long_url: "https://example.com",
                    is_custom_alias: false
                }
            });
            await prisma_1.default.clickEvent.createMany({
                data: [
                    {
                        link_id: mockLinkId,
                        ip: "1.1.1.1",
                        os: "Windows",
                        device_type: "Desktop",
                        date: new Date()
                    },
                    {
                        link_id: mockLinkId,
                        ip: "1.1.1.1",
                        os: "Windows",
                        device_type: "Desktop",
                        date: new Date()
                    },
                    {
                        link_id: mockLinkId,
                        ip: "2.2.2.2",
                        os: "iOS",
                        device_type: "Mobile",
                        date: new Date()
                    }
                ]
            });
            const response = await agent
                .get("/api/analytics")
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalUrls).toBe(1);
            expect(response.body.data.totalClicks).toBe(3);
            expect(response.body.data.uniqueClicks).toBe(2);
            expect(response.body.data.osType).toHaveLength(2);
            expect(response.body.data.deviceType).toHaveLength(2);
        });
    });
    describe("GET /api/analytics/topic/:topicId", () => {
        it("should return 400 if topicId is missing", async () => {
            const response = await agent
                .get("/api/analytics/topic/")
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(404);
        });
        it("should return 404 if topic not found", async () => {
            const response = await agent
                .get("/api/analytics/topic/nonexistent")
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
        it("should return empty analytics for topic with no links", async () => {
            // Create test topic
            await prisma_1.default.topic.create({
                data: {
                    topic_id: mockTopicId,
                    user_id: mockUserId,
                    name: "Test Topic"
                }
            });
            const response = await agent
                .get(`/api/analytics/topic/${mockTopicId}`)
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual({
                totalClicks: 0,
                uniqueClicks: 0,
                clicksByDate: [],
                urls: []
            });
        });
        it("should return analytics data for topic's links", async () => {
            // Create test data
            const topic = await prisma_1.default.topic.create({
                data: {
                    topic_id: mockTopicId,
                    user_id: mockUserId,
                    name: "Test Topic",
                    shortenedLinks: {
                        create: {
                            link_id: mockLinkId,
                            user_id: mockUserId,
                            long_url: "https://example.com",
                            is_custom_alias: false
                        }
                    }
                }
            });
            await prisma_1.default.clickEvent.create({
                data: {
                    link_id: mockLinkId,
                    ip: "1.1.1.1",
                    os: "Windows",
                    device_type: "Desktop",
                    date: new Date()
                }
            });
            const response = await agent
                .get(`/api/analytics/topic/${mockTopicId}`)
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalClicks).toBe(1);
            expect(response.body.data.uniqueClicks).toBe(1);
            expect(response.body.data.urls).toHaveLength(1);
        });
    });
    describe("GET /api/analytics/alias/:alias", () => {
        it("should return 400 if alias is missing", async () => {
            const response = await agent
                .get("/api/analytics/alias/")
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(404);
        });
        it("should return 404 if link not found", async () => {
            const response = await agent
                .get("/api/analytics/alias/nonexistent")
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
        it("should return analytics data for specific link", async () => {
            // Create test data
            await prisma_1.default.shortenedLink.create({
                data: {
                    link_id: mockLinkId,
                    user_id: mockUserId,
                    long_url: "https://example.com",
                    is_custom_alias: false
                }
            });
            await prisma_1.default.clickEvent.createMany({
                data: [
                    {
                        link_id: mockLinkId,
                        ip: "1.1.1.1",
                        os: "Windows",
                        device_type: "Desktop",
                        date: new Date()
                    },
                    {
                        link_id: mockLinkId,
                        ip: "2.2.2.2",
                        os: "iOS",
                        device_type: "Mobile",
                        date: new Date()
                    }
                ]
            });
            const response = await agent
                .get(`/api/analytics/alias/${mockLinkId}`)
                .set("Authorization", constants_1.token);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalClicks).toBe(2);
            expect(response.body.data.uniqueClicks).toBe(2);
            expect(response.body.data.osType).toHaveLength(2);
            expect(response.body.data.deviceType).toHaveLength(2);
        });
    });
});
