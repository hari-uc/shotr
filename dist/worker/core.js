"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqs_consumer_1 = require("sqs-consumer");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const processor_1 = require("./processor");
const { SHOTR_SQS_QUEUE_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
const app = sqs_consumer_1.Consumer.create({
    queueUrl: SHOTR_SQS_QUEUE_URL,
    handleMessage: async (message) => {
        (0, processor_1.processMessage)(message);
    },
    sqs: new client_sqs_1.SQSClient({
        region: AWS_REGION,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
    }),
});
exports.default = app;
