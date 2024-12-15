import mongoose from "mongoose";

const portSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Port = mongoose.model("Port", portSchema);

export default Port;
