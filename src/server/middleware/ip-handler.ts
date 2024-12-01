import { Request, Response, NextFunction } from "express";
import { getClientIp } from "request-ip";

export const ipHandler = (req: Request, res: Response, next: NextFunction) => {
    req.clientIp = getClientIp(req) || null;
    next();
}