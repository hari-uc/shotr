"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseWrapper = void 0;
const responseWrapper = (res, { data, success = true, error = null, status = 200, message, meta = {}, }) => {
    res.status(status).json({
        success,
        data,
        error,
        message,
        meta,
    });
};
exports.responseWrapper = responseWrapper;
