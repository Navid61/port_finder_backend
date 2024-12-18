import request from "supertest";
import express, { Request, Response } from "express";
import app from "../app";

// Mock the logger to avoid real logs during tests
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// Mock the port routes to avoid actual database calls
jest.mock("../routes/port.routes", () => {
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Mocked route" });
  });
  return router;
});

describe("App", () => {
  it("should initialize and respond to GET /ports", async () => {
    const response = await request(app).get("/ports");
    expect(response.status).toBe(200); // Ensure the status is 200
    expect(response.body).toEqual({ message: "Mocked route" }); // Ensure the mocked response matches
  });
});
