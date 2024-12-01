import { Router } from "express";
import authRoutes from "./auth";
import shortenerRoutes from "./shortener";
import analyticsRoutes from "./analytics";

const router = Router();

router.use('/auth', authRoutes);
router.use('/shorten', shortenerRoutes);
router.use('/analytics', analyticsRoutes);
export default router;
    