"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMessage = void 0;
const ua_parser_js_1 = require("ua-parser-js");
const logger_1 = __importDefault(require("../utils/logger"));
const prisma_1 = __importDefault(require("../config/prisma"));
const axios_1 = __importDefault(require("axios"));
const IP_API_BASE_URL = 'http://ip-api.com/json';
async function getLocation(ip) {
    try {
        const response = await axios_1.default.get(`${IP_API_BASE_URL}/${ip}`, { timeout: 5000 });
        if (response.data.status === 'fail') {
            logger_1.default.error('Failed to fetch IP data:', response.data.message);
            return null;
        }
        return response.data;
    }
    catch (error) {
        const axiosError = error;
        logger_1.default.error('Error fetching IP information:', {
            error: axiosError.message,
            code: axiosError.code,
            ip
        });
        return null;
    }
}
const processMessage = async (message) => {
    if (!message.Body) {
        logger_1.default.error('Empty message body received');
        return;
    }
    try {
        const data = JSON.parse(message.Body);
        const { ip, userAgent, alias } = data;
        if (!ip || !userAgent || !alias) {
            throw new Error('Missing required fields in message data');
        }
        const parser = new ua_parser_js_1.UAParser(userAgent);
        const { browser, os } = parser.getResult();
        const geoLocation = await getLocation(ip);
        const eventObject = {
            shortenedLink: {
                connect: {
                    link_id: alias
                }
            },
            ip,
            user_agent: userAgent,
            os: os?.name || '',
            device_type: browser?.name || '',
            geolocation: geoLocation?.country || '',
            date: new Date().toISOString(),
            meta: { ...geoLocation }
        };
        await prisma_1.default.clickEvent.create({
            data: eventObject
        });
        logger_1.default.info('Successfully processed click event', {
            alias,
            ip,
            country: geoLocation?.country
        });
    }
    catch (error) {
        logger_1.default.error('Error processing message:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            messageId: message.MessageId,
            body: message.Body
        });
    }
};
exports.processMessage = processMessage;
