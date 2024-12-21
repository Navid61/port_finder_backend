import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface for Port document
export interface IPort extends Document {
  name: string;
}

// Define the Mongoose schema
const PortSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }, // Ensure name is unique
});

// Export the Mongoose model with TypeScript typing
export default mongoose.model<IPort>("Port", PortSchema);
