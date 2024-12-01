import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createShortenedLink, redirectAlias } from "../controller/shortener";

const router = Router();

router.post("/", authenticate, createShortenedLink);
router.get("/:alias", redirectAlias);
export default router;