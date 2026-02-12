import { FastifyInstance } from "fastify";
import { buildApp } from "./helpers";
import { HttpStatus } from "../../utils";
import { cleanDatabase, disconnectDatabase } from "../setup/test-helpers";

describe("Link Routes (e2e)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
    await disconnectDatabase();
  });

  describe("POST /links", () => {
    it("should create a link and return 201", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "https://www.example.com",
          shortLink: "example",
        },
      });

      expect(response.statusCode).toBe(HttpStatus.CREATED);

      const body = response.json();
      expect(body.id).toBeDefined();
      expect(body.link).toBe("https://www.example.com");
      expect(body.shortLink).toBe("example");
      expect(body.shortUrl).toContain("/example");
      expect(body.createdAt).toBeDefined();
    });

    it("should return 400 when link is missing", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          shortLink: "example",
        },
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      const body = response.json();
      expect(body.errors).toBeDefined();
    });

    it("should return 400 when shortLink is missing", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "https://www.example.com",
        },
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("should return 400 when link is not a valid URL", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "not-a-url",
          shortLink: "example",
        },
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("should return 400 when shortLink has invalid characters", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "https://www.example.com",
          shortLink: "has spaces!",
        },
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("should return 400 when shortLink exceeds max length", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "https://www.example.com",
          shortLink: "a".repeat(51),
        },
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /links", () => {
    it("should return 200 with empty array", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/links",
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.json()).toEqual([]);
    });

    it("should return 200 with all created links", async () => {
      await app.inject({
        method: "POST",
        url: "/links",
        payload: { link: "https://www.google.com", shortLink: "google" },
      });

      await app.inject({
        method: "POST",
        url: "/links",
        payload: { link: "https://www.github.com", shortLink: "github" },
      });

      const response = await app.inject({
        method: "GET",
        url: "/links",
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = response.json();
      expect(body).toHaveLength(2);
    });

    it("should return links ordered by createdAt desc", async () => {
      await app.inject({
        method: "POST",
        url: "/links",
        payload: { link: "https://www.first.com", shortLink: "first" },
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await app.inject({
        method: "POST",
        url: "/links",
        payload: { link: "https://www.second.com", shortLink: "second" },
      });

      const response = await app.inject({
        method: "GET",
        url: "/links",
      });

      const body = response.json();
      expect(body[0].shortLink).toBe("second");
      expect(body[1].shortLink).toBe("first");
    });
  });

  describe("GET /:shortLink", () => {
    it("should redirect with 302 when link exists", async () => {
      await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "https://www.example.com",
          shortLink: "redirect-test",
        },
      });

      const response = await app.inject({
        method: "GET",
        url: "/redirect-test",
      });

      expect(response.statusCode).toBe(HttpStatus.FOUND);
      expect(response.headers.location).toBe("https://www.example.com");
    });

    it("should return 404 when link does not exist", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/nonexistent",
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 400 when shortLink has invalid format", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/invalid link!",
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("DELETE /links/:id", () => {
    it("should delete a link and return 204", async () => {
      const createResponse = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "https://www.example.com",
          shortLink: "to-delete",
        },
      });

      const { id } = createResponse.json();

      const deleteResponse = await app.inject({
        method: "DELETE",
        url: `/links/${id}`,
      });

      expect(deleteResponse.statusCode).toBe(HttpStatus.NO_CONTENT);

      // Verify link is actually deleted
      const getResponse = await app.inject({
        method: "GET",
        url: "/to-delete",
      });

      expect(getResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("should return 400 when id is not a valid UUID", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/links/invalid-uuid",
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("Full flow", () => {
    it("should create, list, redirect and delete a link", async () => {
      // 1. Create
      const createResponse = await app.inject({
        method: "POST",
        url: "/links",
        payload: {
          link: "https://www.example.com/full-flow",
          shortLink: "flow",
        },
      });

      expect(createResponse.statusCode).toBe(HttpStatus.CREATED);
      const { id } = createResponse.json();

      // 2. List
      const listResponse = await app.inject({
        method: "GET",
        url: "/links",
      });

      expect(listResponse.statusCode).toBe(HttpStatus.OK);
      expect(listResponse.json()).toHaveLength(1);

      // 3. Redirect
      const redirectResponse = await app.inject({
        method: "GET",
        url: "/flow",
      });

      expect(redirectResponse.statusCode).toBe(HttpStatus.FOUND);
      expect(redirectResponse.headers.location).toBe(
        "https://www.example.com/full-flow"
      );

      // 4. Delete
      const deleteResponse = await app.inject({
        method: "DELETE",
        url: `/links/${id}`,
      });

      expect(deleteResponse.statusCode).toBe(HttpStatus.NO_CONTENT);

      // 5. Verify deleted
      const listAfterDelete = await app.inject({
        method: "GET",
        url: "/links",
      });

      expect(listAfterDelete.json()).toHaveLength(0);
    });
  });
});
