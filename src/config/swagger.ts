import swaggerJSDoc from 'swagger-jsdoc';
const { NGROK_DOMAIN } = process.env;

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Shotr API',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:8080/api`,
        description: 'Local server',
      },
      {
        url: `https://${NGROK_DOMAIN}/api`,
        description: 'Ngrok server',
      },
    ],
  },
  apis: [`${__dirname}/../server/routes/*.ts`, `${__dirname}/../server/controllers/*.ts`],
};

export default swaggerJSDoc(options);
