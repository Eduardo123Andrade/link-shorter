import { deleteLinkController } from "../delete-link.controller";
import { mockRequest, mockReply } from "./helpers";
import { HttpStatus } from "../../utils";

jest.mock("../../use-case", () => ({
  deleteLink: jest.fn(),
}));

import { deleteLink } from "../../use-case";

const mockDeleteLink = deleteLink as jest.MockedFunction<typeof deleteLink>;

describe("deleteLinkController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete link and return 204", async () => {
    const params = { id: "550e8400-e29b-41d4-a716-446655440000" };
    const request = mockRequest({ params });
    const reply = mockReply();

    const mockResult = {
      id: params.id,
      link: "https://example.com",
      shortLink: "abc123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDeleteLink.mockResolvedValue(mockResult);

    await deleteLinkController(request, reply);

    expect(mockDeleteLink).toHaveBeenCalledWith({ id: params.id });
    expect(reply.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
    expect(reply.send).toHaveBeenCalled();
  });

  it("should return 400 when id is not a valid UUID", async () => {
    const params = { id: "invalid-uuid" };
    const request = mockRequest({ params });
    const reply = mockReply();

    await deleteLinkController(request, reply);

    expect(mockDeleteLink).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it("should return 400 when id is empty", async () => {
    const params = { id: "" };
    const request = mockRequest({ params });
    const reply = mockReply();

    await deleteLinkController(request, reply);

    expect(mockDeleteLink).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it("should return 400 when id is missing", async () => {
    const request = mockRequest({ params: {} });
    const reply = mockReply();

    await deleteLinkController(request, reply);

    expect(mockDeleteLink).not.toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });

  it("should propagate errors from use case", async () => {
    const params = { id: "550e8400-e29b-41d4-a716-446655440000" };
    const request = mockRequest({ params });
    const reply = mockReply();

    mockDeleteLink.mockRejectedValue(new Error("Record not found"));

    await expect(deleteLinkController(request, reply)).rejects.toThrow(
      "Record not found"
    );
  });
});
