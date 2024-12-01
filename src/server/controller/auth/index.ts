import prisma from "../../../config/prisma";
import { generateToken } from "../../../utils/jwt";
import logger from "../../../utils/logger";
import { responseWrapper } from "../../../utils/resonseWrapper";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);


const verifyGoogleToken = async (token: string): Promise<any> => {
    const ticket = await oAuth2Client.verifyIdToken({
        idToken: token,
        audience: clientId,
    });
    return ticket.getPayload();
};


const createUser = async (user: any) => {

    const requiredFields = {
        email: user.email,
        username: user.name,
        source: "google"
    }
    return await prisma.users.upsert({
        where: { email: user.email },
        update: requiredFields,
        create: requiredFields
    });
}


export const exchangeGoogleToken = async (req: Request, res: Response) => {
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

        const serverToken = generateToken({
            user_id: user.user_id,
            email: user.email,
            username: user.username,
        });

        return responseWrapper(res, { data: { accessToken: serverToken }, status: 200, success: true });
    } catch (error: any) {
        logger.error(error);
        return responseWrapper(res, { error: error.message, message: 'Error processing Google auth', status: 500, success: false });
    }
}
