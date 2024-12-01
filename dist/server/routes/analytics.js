"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_1 = require("../controller/analytics");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /analytics/overall:
 *   get:
 *     summary: view overall analytics
 *     description: view overall analytics
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Successfully fetched the overall analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   description: Total number of shortened URLs created by the user.
 *                   example: 5
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks across all shortened links.
 *                   example: 120
 *                 uniqueClicks:
 *                   type: integer
 *                   description: Number of unique clicks.
 *                   example: 100
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         description: The date of the clicks.
 *                         example: "2024-12-01"
 *                       totalClicks:
 *                         type: integer
 *                         description: The number of clicks on that date.
 *                         example: 10
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: The operating system used for the click.
 *                         example: "Windows"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from that OS.
 *                         example: 50
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users from that OS.
 *                         example: 40
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: The type of device used for the click.
 *                         example: "Mobile"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from that device.
 *                         example: 60
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users from that device.
 *                         example: 55
 *       500:
 *         description: Internal server error.
 */
router.get('/overall', auth_1.authenticate, analytics_1.getOverAllAnalytics);
/**
 * @swagger
 * /analytics/topic/{topicId}:
 *   get:
 *     summary: view analytics based on topic
 *     description: view analytics based on topic
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         description: The topic ID for which analytics will be fetched.
 *         schema:
 *           type: string
 *           example: "technology123"
 *     responses:
 *       200:
 *         description: Successfully fetched the analytics data for the topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks for links under this topic.
 *                   example: 60
 *                 uniqueClicks:
 *                   type: integer
 *                   description: Number of unique clicks for links under this topic.
 *                   example: 50
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         description: The date of the clicks.
 *                         example: "2024-12-01"
 *                       totalClicks:
 *                         type: integer
 *                         description: The number of clicks on that date.
 *                         example: 15
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         description: The shortened URL.
 *                         example: "https://short.url/abc123"
 *                       totalClicks:
 *                         type: integer
 *                         description: The number of clicks for this specific link.
 *                         example: 25
 *       400:
 *         description: Topic ID is required.
 *       404:
 *         description: Topic not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/topic/:topicId', auth_1.authenticate, analytics_1.getAnalyticsByTopic);
/**
 * @swagger
 * /analytics/alias/{alias}:
 *   get:
 *     summary: view analytics based on alias
 *     description: view analytics based on alias
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the shortened URL.
 *         schema:
 *           type: string
 *           example: "custom-alias123"
 *     responses:
 *       200:
 *         description: Successfully fetched the analytics data for the alias.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks for this specific alias.
 *                   example: 35
 *                 uniqueClicks:
 *                   type: integer
 *                   description: Number of unique clicks for this alias.
 *                   example: 30
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         description: The date of the clicks.
 *                         example: "2024-12-01"
 *                       totalClicks:
 *                         type: integer
 *                         description: The number of clicks on that date.
 *                         example: 10
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: The operating system used for the click.
 *                         example: "Android"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from that OS.
 *                         example: 20
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users from that OS.
 *                         example: 18
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: The type of device used for the click.
 *                         example: "Tablet"
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from that device.
 *                         example: 25
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users from that device.
 *                         example: 22
 *       400:
 *         description: Alias is required.
 *       404:
 *         description: Link not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:alias', auth_1.authenticate, analytics_1.getAnalyticsByAlias);
exports.default = router;
