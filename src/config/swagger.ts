import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { configApp } from "./config_app";

// Definisi Meta Data API Anda
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FlashTicket API Documentation",
      version: "1.0.0",
      description: "API documentation for High Performance Ticketing System",
      contact: {
        name: "Abdullah Fathan", // Tulis nama Anda, ini portofolio!
      },
    },
    servers: [
      {
        url: `http://localhost:${configApp.app.port}`,
        description: "Development Server",
      },
    ],
    // Konfigurasi agar Swagger tahu kita pakai Bearer Token (JWT)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Terapkan security ini secara default (opsional, bisa ditaruh per-endpoint)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Beritahu Swagger di mana letak anotasi dokumentasinya
  apis: ["./src/docs/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

// Fungsi untuk memasang Swagger ke Express App
export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger Docs available at http://localhost:3000/api-docs");
};
