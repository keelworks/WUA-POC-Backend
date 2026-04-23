import express from 'express';
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";

const app = express();
app.use(express.json());

app.use("/docs", swaggerUi.serve, async (_req: any, res: any) => {
    return res.send(swaggerUi.generateHTML(await import("../public/swagger.json")));
});

RegisterRoutes(app);

export { app };
