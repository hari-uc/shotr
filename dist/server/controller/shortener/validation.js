"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createLinkValidation = zod_1.default.object({
    longUrl: zod_1.default.string().url(),
    topic: zod_1.default.string().optional(),
    customAlias: zod_1.default.string().min(4).max(10).optional()
});
