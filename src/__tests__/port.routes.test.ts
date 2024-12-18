import request from "supertest";
import express, { Application } from "express";
import portRoutes from "../routes/port.routes";
import Port from "../models/port.model";

// Mock the Port model
jest.mock("../models/port.model");

const mockedPort = Port as jest.Mocked<typeof Port>;

describe("Port Routes", () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json()); // Middleware to parse JSON
    app.use("/ports", portRoutes); // Add port routes
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe("GET /ports", () => {
    it("should return all ports", async () => {
      // Mock the behavior of Port.find
      mockedPort.find.mockResolvedValue([{ name: "Port A" }, { name: "Port B" }]);

      const response = await request(app).get("/ports");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ name: "Port A" }, { name: "Port B" }]);
      expect(mockedPort.find).toHaveBeenCalled();
    });

    it("should return 500 if fetching ports fails", async () => {
      mockedPort.find.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/ports");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to fetch ports" });
      expect(mockedPort.find).toHaveBeenCalled();
    });
  });

  describe("POST /ports", () => {
    it("should add a new port", async () => {
      // Mock the behavior of saving a new port
      const newPort = { name: "Port C" };
      const savedPort = { _id: "123", ...newPort };

      mockedPort.prototype.save = jest.fn().mockResolvedValue(savedPort);

      const response = await request(app).post("/ports").send(newPort);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(savedPort);
      expect(mockedPort.prototype.save).toHaveBeenCalled();
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app).post("/ports").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Name is required" });
    });

    it("should return 400 if saving port fails", async () => {
      mockedPort.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/ports").send({ name: "Port D" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Failed to add port" });
      expect(mockedPort.prototype.save).toHaveBeenCalled();
    });
  });
});
