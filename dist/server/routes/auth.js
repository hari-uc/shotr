"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/google/exchange-token:
 *   post:
 *     summary: Exchange Google token for server-side access token
 *     description: This endpoint verifies the provided Google token, creates a user if it's valid, and returns a server-side access token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The Google authentication token to be verified.
 *                 example: "google token"
 *     responses:
 *       200:
 *         description: Successfully exchanged Google token for server-side access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The server-side generated access token.
 *                   example: "server token"
 *       400:
 *         description: Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.post('/token/exchange', auth_1.exchangeGoogleToken);
exports.default = router;
