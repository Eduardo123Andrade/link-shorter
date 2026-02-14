import { createLinkController } from "../create-link.controller";
import { mockRequest, mockReply } from "./helpers";
import { HttpStatus } from "../../utils";
import { ValidationError } from "../../errors";

jest.mock("../../use-case", () => ({
  createLink: jest.fn(),
}));

import { createLink } from "../../use-case";

const mockCreateLink = createLink as jest.MockedFunction<typeof createLink>;

describe("createLinkController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a link and return 201", async () => {
    const body = { link: "https://example.com", shortLink: "abc123" };
    const request = mockRequest({ body });
    const reply = mockReply();

    const mockResult = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      link: body.link,
      shortLink: body.shortLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCreateLink.mockResolvedValue(mockResult);

    await createLinkController(request, reply);

    expect(mockCreateLink).toHaveBeenCalledWith(body);
    expect(reply.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockResult.id,
        link: mockResult.link,
        shortLink: `http://localhost:3334/${mockResult.shortLink}`,
      })
    );
  });

  it("should throw ValidationError when link is missing", async () => {
    const body = { shortLink: "abc123" };
    const request = mockRequest({ body });
    const reply = mockReply();

    await expect(createLinkController(request, reply)).rejects.toThrow(
      ValidationError
    );
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it("should throw ValidationError when shortLink is missing", async () => {
    const body = { link: "https://example.com" };
    const request = mockRequest({ body });
    const reply = mockReply();

    await expect(createLinkController(request, reply)).rejects.toThrow(
      ValidationError
    );
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it("should throw ValidationError when link is not a valid URL", async () => {
    const body = { link: "not-a-url", shortLink: "abc123" };
    const request = mockRequest({ body });
    const reply = mockReply();

    await expect(createLinkController(request, reply)).rejects.toThrow(
      ValidationError
    );
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it("should throw ValidationError when shortLink has invalid characters", async () => {
    const body = { link: "https://example.com", shortLink: "abc 123!" };
    const request = mockRequest({ body });
    const reply = mockReply();

    await expect(createLinkController(request, reply)).rejects.toThrow(
      ValidationError
    );
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it("should throw ValidationError when shortLink exceeds max length", async () => {
    const body = {
      link: "https://example.com",
      shortLink: "a".repeat(51),
    };
    const request = mockRequest({ body });
    const reply = mockReply();

    await expect(createLinkController(request, reply)).rejects.toThrow(
      ValidationError
    );
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it("should throw ValidationError when body is empty", async () => {
    const request = mockRequest({ body: {} });
    const reply = mockReply();

    await expect(createLinkController(request, reply)).rejects.toThrow(
      ValidationError
    );
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it("should have fieldErrors in ValidationError", async () => {
    const body = { shortLink: "abc123" };
    const request = mockRequest({ body });
    const reply = mockReply();

    try {
      await createLinkController(request, reply);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).fieldErrors).toBeDefined();
      expect((error as ValidationError).statusCode).toBe(
        HttpStatus.BAD_REQUEST
      );
    }
  });
});
