import mongoose, { ConnectOptions } from "mongoose";
import logger from "./logger";

interface RetryOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  initialDelayMs?: number;
}

export const connectWithRetry = async (mongoUri: string, options: RetryOptions = {}): Promise<void> => {
  const { maxRetries = 5, retryDelayMs = 5000, initialDelayMs = 0 } = options;
  let retries = 0;

  if (initialDelayMs > 0) {
    logger.info(`Waiting ${initialDelayMs / 1000} seconds before initial connection attempt...`);
    await new Promise((resolve) => setTimeout(resolve, initialDelayMs));
  }

  const mongooseOptions: ConnectOptions = {
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    autoIndex: true,
  };

  while (retries < maxRetries) {
    try {
      logger.info(`Attempting to connect to MongoDB at ${mongoUri}...`);
      await mongoose.connect(mongoUri, mongooseOptions);
      logger.info("Connected to MongoDB!");
      return;
    } catch (error: any) {
      retries++;
      logger.warn(`MongoDB connection attempt ${retries} failed: ${error.message}. Retrying in ${retryDelayMs / 1000} seconds...`);
      if (retries >= maxRetries) {
        logger.error(`Max retries exceeded. Could not connect to MongoDB.`);
        if (mongoose.connection.readyState === 1) await mongoose.disconnect();
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
};
