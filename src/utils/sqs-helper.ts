import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";


const { SHOTR_SQS_QUEUE_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

const sqs = new SQSClient({
    region: AWS_REGION as string,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID as string,
        secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
    },
});

export const sendMessageToSQS = async (message: string) => {
    const command = new SendMessageCommand({
        QueueUrl: SHOTR_SQS_QUEUE_URL as string,
        MessageBody: message,
    });

    await sqs.send(command);
}