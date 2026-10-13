import express from "express";
import swaggerUi from "swagger-ui-express";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
