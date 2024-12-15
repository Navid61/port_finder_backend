import mongoose from "mongoose";
import app from "./app";

const PORT = 5000; // Backend server port
const MONGO_URI = "mongodb://localhost:27017/portsDB"; // Replace with your MongoDB URI

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));
