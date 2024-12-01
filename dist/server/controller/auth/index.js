"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeGoogleToken = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const jwt_1 = require("../../../utils/jwt");
const logger_1 = __importDefault(require("../../../utils/logger"));
const resonseWrapper_1 = require("../../../utils/resonseWrapper");
const google_auth_library_1 = require("google-auth-library");
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;
const oAuth2Client = new google_auth_library_1.OAuth2Client(clientId, clientSecret, redirectUri);
const verifyGoogleToken = async (token) => {
    const ticket = await oAuth2Client.verifyIdToken({
        idToken: token,
        audience: clientId,
    });
    return ticket.getPayload();
};
const createUser = async (user) => {
    const requiredFields = {
        email: user.email,
        username: user.name,
        source: "google"
    };
    return await prisma_1.default.users.upsert({
        where: { email: user.email },
        update: requiredFields,
        create: requiredFields
    });
};
const exchangeGoogleToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new Error('Token is required');
        }
        const googleUser = await verifyGoogleToken(token);
        if (!googleUser) {
            throw new Error('Invalid token');
        }
        const user = await createUser(googleUser);
        const serverToken = (0, jwt_1.generateToken)({
            user_id: user.user_id,
            email: user.email,
            username: user.username,
        });
        return (0, resonseWrapper_1.responseWrapper)(res, { data: { accessToken: serverToken }, status: 200, success: true });
    }
    catch (error) {
        logger_1.default.error(error);
        return (0, resonseWrapper_1.responseWrapper)(res, { error: error.message, message: 'Error processing Google auth', status: 500, success: false });
    }
};
exports.exchangeGoogleToken = exchangeGoogleToken;
