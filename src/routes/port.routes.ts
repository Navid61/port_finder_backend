import express from "express";
import { Port } from "../models/port.model";

const router = express.Router();

// Fetch all ports or search by name
router.get("/", async (req, res) => {
  const search = req.query.search?.toString();
  try {
    const ports = search
      ? await Port.find({ original: new RegExp(search, "i") }) // Case-insensitive search
      : await Port.find();
    res.json(ports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ports" });
  }
});

// Add a new port
router.post("/", async (req, res) => {
  try {
    const port = new Port(req.body);
    await port.save();
    res.status(201).json(port);
  } catch (error) {
    res.status(400).json({ error: "Failed to add port" });
  }
});

export default router;
