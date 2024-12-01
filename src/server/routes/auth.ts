import { Router } from "express";
import { exchangeGoogleToken } from "../controller/auth";

const router = Router();

router.post('/token/exchange', exchangeGoogleToken);

export default router;
