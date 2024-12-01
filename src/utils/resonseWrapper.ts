import { Response } from "express";

export const responseWrapper = (
    res: Response,
    {
        data,
        success = true,
        error = null,
        status = 200,
        message,
        meta = {},
    }: {
        data?: any;
        success?: boolean;
        error?: string | null;
        status?: number;
        message?: string;
        meta?: any;
    }
) => {
    res.status(status).json({
        success,
        data,
        error,
        message,
        meta,
    });
};
