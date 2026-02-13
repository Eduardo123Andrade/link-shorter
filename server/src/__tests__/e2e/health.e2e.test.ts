import { FastifyInstance } from "fastify";
import { buildApp } from "./helpers";
import { HttpStatus } from "../../utils";
import { disconnectDatabase } from "../setup/test-helpers";

describe("Health Routes (e2e)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
    await disconnectDatabase();
  });

  describe("GET /health", () => {
    it("should return 200 with status ok", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = response.json();
      expect(body.status).toBe("ok");
      expect(body.timestamp).toBeDefined();
    });
  });

  describe("GET /health/db", () => {
    it("should return 200 when database is connected", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/health/db",
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = response.json();
      expect(body.status).toBe("ok");
      expect(body.database).toBe("connected");
    });
  });
});
