import { findLinkByShortLinkController } from "../find-link-by-short-link.controller";
import { mockRequest, mockReply } from "./helpers";
import { HttpStatus } from "../../utils";
import { ValidationError } from "../../errors";

jest.mock("../../use-case", () => ({
  findLinkByShortLink: jest.fn(),
}));

import { findLinkByShortLink } from "../../use-case";

const mockFindLinkByShortLink = findLinkByShortLink as jest.MockedFunction<
  typeof findLinkByShortLink
>;

describe("findLinkByShortLinkController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect with 302 when link is found", async () => {
    const params = { shortLink: "abc123" };
    const request = mockRequest({ params });
    const reply = mockReply();

    const mockLink = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      link: "https://example.com",
      shortLink: "abc123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockFindLinkByShortLink.mockResolvedValue(mockLink);

    await findLinkByShortLinkController(request, reply);

    expect(mockFindLinkByShortLink).toHaveBeenCalledWith(params);
    expect(reply.code).toHaveBeenCalledWith(HttpStatus.FOUND);
    expect(reply.redirect).toHaveBeenCalledWith(mockLink.link);
  });

  it("should throw ValidationError when shortLink has invalid characters", async () => {
    const params = { shortLink: "abc 123!" };
    const request = mockRequest({ params });
    const reply = mockReply();

    await expect(
      findLinkByShortLinkController(request, reply)
    ).rejects.toThrow(ValidationError);
    expect(mockFindLinkByShortLink).not.toHaveBeenCalled();
  });

  it("should throw ValidationError when shortLink is empty", async () => {
    const params = { shortLink: "" };
    const request = mockRequest({ params });
    const reply = mockReply();

    await expect(
      findLinkByShortLinkController(request, reply)
    ).rejects.toThrow(ValidationError);
    expect(mockFindLinkByShortLink).not.toHaveBeenCalled();
  });

  it("should propagate errors from use case", async () => {
    const params = { shortLink: "abc123" };
    const request = mockRequest({ params });
    const reply = mockReply();

    mockFindLinkByShortLink.mockRejectedValue(new Error("Link not found"));

    await expect(
      findLinkByShortLinkController(request, reply)
    ).rejects.toThrow("Link not found");
  });
});
