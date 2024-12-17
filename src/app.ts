import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import portRoutes from "./routes/port.routes";
import logger from "./utils/logger";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
logger.info("Initializing routes...");
app.use("/ports", portRoutes);

export default app;
