import swaggerJSDoc from "swagger-jsdoc";

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

export default swaggerJSDoc(options);

