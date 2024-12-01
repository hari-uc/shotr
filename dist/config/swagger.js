"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Shotr API",
            version: "1.0.0",
        },
    },
    apis: ["./src/server/routes/*.ts", "./src/server/controllers/*.ts"],
};
exports.default = (0, swagger_jsdoc_1.default)(options);
