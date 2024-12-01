"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLinkId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateLinkId = (length = 6) => {
    return crypto_1.default.randomBytes(length).toString('hex').slice(0, length);
};
exports.generateLinkId = generateLinkId;
