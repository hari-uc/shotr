"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../../utils/jwt");
const resonseWrapper_1 = require("../../utils/resonseWrapper");
const logger_1 = __importDefault(require("../../utils/logger"));
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return (0, resonseWrapper_1.responseWrapper)(res, { error: 'Unauthorized', status: 401, success: false });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            return (0, resonseWrapper_1.responseWrapper)(res, { error: 'Unauthorized', status: 401, success: false });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.error(error);
        return (0, resonseWrapper_1.responseWrapper)(res, { error: 'Unauthorized', status: 401, success: false });
    }
};
exports.authenticate = authenticate;
