import express, { Request, Response } from "express";
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
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name }: { name: string } = req.body; // Extract 'name' with type-checking
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const newPort = new Port({ name });
    const savedPort = await newPort.save();
    res.status(201).json(savedPort);
  } catch (error) {
    console.error("Error adding port:", error);
    res.status(400).json({ error: "Failed to add port" });
  }
});

export default router;
