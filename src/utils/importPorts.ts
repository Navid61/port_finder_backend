import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Port from "../models/port.model";

dotenv.config();

const waitForMongo = async (uri: string, retries = 12, delay = 5000) => {
  while (retries > 0) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      });
      console.log("Connected to MongoDB");
      return;
    } catch (err: any) {
      console.error(`MongoDB not ready yet. Retrying... (${retries} retries left)`, err.message);
      retries--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("MongoDB did not become ready in time");
};

const importPorts = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/ports";
    console.log("Waiting for MongoDB...");
    await waitForMongo(MONGO_URI);

    const existingCount = await Port.countDocuments();
    if (existingCount > 0) {
      console.log(`Skipping import. ${existingCount} ports already exist.`);
      return; // Exit the function early
    }

    console.log("No data found. Importing ports...");

    // Correct the file path relative to the compiled output directory
    const filePath = path.join(__dirname, "../../data/ports.csv"); // Adjusted for `dist/` output
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`Reading from: ${filePath}`);

    const ports: { name: string }[] = [];
    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

    for await (const row of parser) {
      if (row.original && typeof row.original === "string") {
        ports.push({ name: row.original });
      } else {
        console.warn("Skipping invalid row:", row);
      }
    }

    console.log(`Parsed ${ports.length} ports.`);

    const batchSize = 1000; // Adjust batch size for performance
    for (let i = 0; i < ports.length; i += batchSize) {
      const batch = ports.slice(i, i + batchSize);
      try {
        const result = await Port.insertMany(batch, { ordered: false });
        console.log(
          `Inserted batch ${Math.ceil((i + batchSize) / batchSize)} of ${Math.ceil(
            ports.length / batchSize
          )}. Inserted ${result.length} documents.`
        );
      } catch (error: any) {
        if (error.code === 11000) {
          console.error(
            `Duplicate key error in batch ${Math.ceil((i + batchSize) / batchSize)}: Skipping duplicates.`
          );
        } else {
          console.error(
            `Failed to insert batch ${Math.ceil((i + batchSize) / batchSize)}:`,
            error
          );
        }
      }
    }

    console.log("Import complete!");
  } catch (err) {
    console.error("Import error:", err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      console.log("Disconnecting from MongoDB...");
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
    }
  }
};

importPorts().catch((err) => console.error("Unhandled error:", err));
