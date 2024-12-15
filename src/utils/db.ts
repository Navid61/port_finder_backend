import mongoose, { ConnectOptions } from "mongoose";

interface RetryOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  initialDelayMs?: number; // Optional initial delay
}

export const connectWithRetry = async (mongoUri: string, options: RetryOptions = {}): Promise<void> => {
  const { maxRetries = 5, retryDelayMs = 5000, initialDelayMs = 0 } = options;
  let retries = 0;

  if (initialDelayMs > 0) {
    console.log(`Waiting ${initialDelayMs / 1000} seconds before initial connection attempt...`);
    await new Promise(resolve => setTimeout(resolve, initialDelayMs));
  }

  const mongooseOptions: ConnectOptions = {
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    autoIndex: true, // Good for development, consider false for production
  };

  while (retries < maxRetries) {
    try {
      console.log(`Attempting to connect to MongoDB at ${mongoUri}...`);
      await mongoose.connect(mongoUri, mongooseOptions);
      console.log("Connected to MongoDB!");
      return;
    } catch (error: any) {
      retries++;
      console.error(`MongoDB connection attempt ${retries} failed: ${error.message}. Retrying in ${retryDelayMs / 1000} seconds...`);

      if (retries >= maxRetries) {
        console.error(`Max retries exceeded. Could not connect to MongoDB at ${mongoUri}.`);
        if (mongoose.connection.readyState === 1) {
          await mongoose.disconnect();
        }
        process.exit(1);
      }

      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    }
  }
};
