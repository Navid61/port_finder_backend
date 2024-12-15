import express from "express";
import Port from "../models/port.model";

const router = express.Router();

// Get all ports
router.get("/", async (req, res) => {
  try {
    const ports = await Port.find();
    res.json(ports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ports" });
  }
});

// Add a new port
router.post("/", async (req, res) => {
  try {
    const newPort = new Port(req.body);
    const savedPort = await newPort.save();
    res.status(201).json(savedPort);
  } catch (error) {
    res.status(400).json({ error: "Failed to add port" });
  }
});

export default router;
