"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const shortener_1 = __importDefault(require("./shortener"));
const analytics_1 = __importDefault(require("./analytics"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/shorten', shortener_1.default);
router.use('/analytics', analytics_1.default);
exports.default = router;
