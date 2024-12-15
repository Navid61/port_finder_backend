import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import portRoutes from "./routes/port.routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/ports", portRoutes);

// MongoDB Connection (moved to server.ts)
// const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/ports";
// connectWithRetry(MONGO_URI);

export default app;