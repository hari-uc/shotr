"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToSQS = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const { SHOTR_SQS_QUEUE_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
const sqs = new client_sqs_1.SQSClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});
const sendMessageToSQS = async (message) => {
    const command = new client_sqs_1.SendMessageCommand({
        QueueUrl: SHOTR_SQS_QUEUE_URL,
        MessageBody: message,
    });
    await sqs.send(command);
};
exports.sendMessageToSQS = sendMessageToSQS;
