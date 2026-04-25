import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Force create swagger route name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/docs", swaggerUi.serve, async (request: Request, response: Response) => {
  const swaggerPath = path.resolve(__dirname, "../public/swagger.json");
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
  return response.send(swaggerUi.generateHTML(swaggerDocument));
});

RegisterRoutes(app);

export { app };
