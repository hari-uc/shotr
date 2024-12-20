import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createShortenedLink, redirectAlias } from "../controller/shortener";

const router = Router();
/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: create a shortened link
 *     description: create a shortened link based on the provided long url, optional custom alias, and topic.
 *     tags:
 *       - Links
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The long URL to shorten.
 *                 example: "https://www.example.com"
 *               topic:
 *                 type: string
 *                 description: Optional topic to categorize the link.
 *                 example: "Technology"
 *               customAlias:
 *                 type: string
 *                 description: Optional custom alias for the shortened link.
 *                 example: "custom-alias"
 *     responses:
 *       200:
 *         description: Shortened link created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated shortened URL.
 *                   example: "https://frontend.com/custom-alias"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of the link creation.
 *                   example: "2024-12-01T00:00:00Z"
 *       400:
 *         description: Invalid request or alias already exists.
 *       404:
 *         description: User/Topic not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authenticate, createShortenedLink);

/**
 * @swagger
 * /redirect/{alias}:
 *   get:
 *     summary: redirect to the original url
 *     description: used to redirect to the original url
 *     tags:
 *       - Links
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias for the shortened link.
 *         schema:
 *           type: string
 *           example: "custom-alias"
 *     responses:
 *       302:
 *         description: Redirect to the long URL.
 *       404:
 *         description: Alias not found, redirecting to 404 page.
 */
router.get("/:alias", redirectAlias);
export default router;