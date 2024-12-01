import { Message } from "@aws-sdk/client-sqs";
import { UAParser } from 'ua-parser-js';
import logger from "../utils/logger";
import prisma from "../config/prisma";
import axios, { AxiosError } from "axios";

interface MessageData {
    ip: string;
    userAgent: string;
    alias: string;
}

interface LocationData {
    country: string;
    status: string;
    message?: string;
    [key: string]: any;
}

interface ClickEventData {
    shortenedLink: {
        connect: {
            link_id: string;
        };
    };
    ip: string;
    user_agent: string;
    os: string;
    device_type: string;
    geolocation: string;
    date: string;
    meta: Record<string, any>;
}

const IP_API_BASE_URL = 'http://ip-api.com/json';


async function getLocation(ip: string): Promise<LocationData | null> {
    try {
        const response = await axios.get<LocationData>(
            `${IP_API_BASE_URL}/${ip}`,
            { timeout: 5000 }
        );

        if (response.data.status === 'fail') {
            logger.error('Failed to fetch IP data:', response.data.message);
            return null;
        }

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        logger.error('Error fetching IP information:', {
            error: axiosError.message,
            code: axiosError.code,
            ip
        });
        return null;
    }
}


export const processMessage = async (message: Message): Promise<void> => {
    if (!message.Body) {
        logger.error('Empty message body received');
        return;
    }

    try {
        const data = JSON.parse(message.Body) as MessageData;
        const { ip, userAgent, alias } = data;

        if (!ip || !userAgent || !alias) {
            throw new Error('Missing required fields in message data');
        }

        const parser = new UAParser(userAgent);
        const { browser, os } = parser.getResult();

        const geoLocation = await getLocation(ip);

        const eventObject: ClickEventData = {
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

        await prisma.clickEvent.create({
            data: eventObject
        });

        logger.info('Successfully processed click event', {
            alias,
            ip,
            country: geoLocation?.country
        });
    } catch (error) {
        logger.error('Error processing message:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            messageId: message.MessageId,
            body: message.Body
        });
    }
}