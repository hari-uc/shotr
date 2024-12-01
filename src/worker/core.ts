import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";
import { processMessage } from "./processor";


const { SHOTR_SQS_QUEUE_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

const app = Consumer.create({
    queueUrl: SHOTR_SQS_QUEUE_URL as string,
    handleMessage: async (message) => {
        processMessage(message);
    },
    sqs: new SQSClient({
        region: AWS_REGION as string,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID as string,
            secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
        },
    }),
})


export default app;