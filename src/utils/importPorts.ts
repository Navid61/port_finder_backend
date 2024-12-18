import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Port from "../models/port.model";
import logger from "./logger";

dotenv.config();

const waitForMongo = async (uri: string, retries = 12, delay = 5000) => {
  while (retries > 0) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      logger.info("Connected to MongoDB");
      return;
    } catch (err: any) {
      logger.warn(`MongoDB not ready yet. Retrying... (${retries} retries left)`);
      retries--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("MongoDB did not become ready in time");
};

const importPorts = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/ports";
    logger.info("Waiting for MongoDB...");
    await waitForMongo(MONGO_URI);

    const existingCount = await Port.countDocuments();
    if (existingCount > 0) {
      logger.info(`Skipping import. ${existingCount} ports already exist.`);
      return;
    }

    const filePath = path.join(__dirname, "../../data/ports.csv");
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

    logger.info(`Reading from file: ${filePath}`);

    const ports: { name: string }[] = [];
    const parser = fs.createReadStream(filePath).pipe(parse({ columns: true }));

    for await (const row of parser) {
      if (row.name) ports.push({ name: row.name });
    }

    logger.info(`Parsed ${ports.length} ports.`);

    const batchSize = 1000;
    for (let i = 0; i < ports.length; i += batchSize) {
      const batch = ports.slice(i, i + batchSize);
      try {
        const result = await Port.insertMany(batch, { ordered: false });
        logger.info(`Inserted batch of ${result.length} documents.`);
      } catch (error: any) {
        logger.error(`Failed to insert batch: ${error.message}`);
      }
    }

    logger.info("Import complete!");
  } catch (err) {
    const error = err as Error; // Explicitly cast to Error
    logger.error(`Import error: ${error.message}`);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      logger.info("Disconnected from MongoDB.");
    }
  }
};

importPorts();

// Export the function for external use or testing
export default importPorts;