import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const routesGlob = path
  .join(__dirname, "../routes/*.{ts,js}")
  .replace(/\\/g, "/");

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskPilot API",
      version: "1.0.0",
      description: "A simple task reminder system",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: [routesGlob],
});
