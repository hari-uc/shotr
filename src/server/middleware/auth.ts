import { verifyToken } from "../../utils/jwt";
import { NextFunction, Request, Response } from "express";
import { responseWrapper } from "../../utils/resonseWrapper";
import logger from "../../utils/logger";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return responseWrapper
                (res, { error: 'Unauthorized', status: 401, success: false });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return responseWrapper(res, { error: 'Unauthorized', status: 401, success: false });
        }
        (req as any).user = decoded;
        next();
    } catch (error: any) {
        logger.error(error);
        return responseWrapper(res, { error: 'Unauthorized', status: 401, success: false });
    }
}