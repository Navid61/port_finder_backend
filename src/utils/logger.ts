import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

// Ensure the logs folder exists
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir); // Create the logs directory if it doesn't exist
}

const logger = createLogger({
  level: "info", // Default log level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Logs to the console
    new transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }), // Log errors to file
    new transports.File({ filename: path.join(logsDir, "combined.log") }) // Log all messages to a file
  ],
});

export default logger;