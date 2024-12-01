import { Request, Response, NextFunction } from "express";
import { getClientIp } from "request-ip";
import logger from "../../utils/logger";

export const ipHandler = (req: Request, res: Response, next: NextFunction) => {
    req.clientIp = getClientIp(req) || null;
    logger.info(`IP: ${req.clientIp} - ${req.originalUrl}`);
    next();
}
