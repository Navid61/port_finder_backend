import mongoose from "mongoose";

const portSchema = new mongoose.Schema({
  original: { type: String, required: true },
  normalized: { type: String, required: true }, // e.g., for deduplicated or cleaned data
});

export const Port = mongoose.model("Port", portSchema);
