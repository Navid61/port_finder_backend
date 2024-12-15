import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import portRoutes from "./routes/port.routes";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/ports", portRoutes);

export default app;
