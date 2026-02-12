import { createLink } from "../create-link.use-case";
import { LinkShorterRepository } from "../../repository/link-shorter.repository";
import * as uuidUtils from "../../utils";

jest.mock("../../repository/link-shorter.repository");
jest.mock("../../utils");

describe("createLink", () => {
  const mockGenerateUuid = uuidUtils.generateUuid as jest.MockedFunction<
    typeof uuidUtils.generateUuid
  >;
  const mockSave = LinkShorterRepository.save as jest.MockedFunction<
    typeof LinkShorterRepository.save
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new link with generated UUID", async () => {
    // Arrange
    const input = {
      link: "https://www.example.com/very-long-url",
      shortLink: "abc123",
    };

    const mockUuid = "550e8400-e29b-41d4-a716-446655440000";
    const mockSavedLink = {
      id: mockUuid,
      link: input.link,
      shortLink: input.shortLink,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };

    mockGenerateUuid.mockReturnValue(mockUuid);
    mockSave.mockResolvedValue(mockSavedLink);

    // Act
    const result = await createLink(input);

    // Assert
    expect(mockGenerateUuid).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith({
      id: mockUuid,
      link: input.link,
      shortLink: input.shortLink,
    });
    expect(result).toEqual(mockSavedLink);
  });

  it("should propagate errors from repository", async () => {
    // Arrange
    const input = {
      link: "https://www.example.com/test",
      shortLink: "test123",
    };

    const mockError = new Error("Database error");
    mockGenerateUuid.mockReturnValue("mock-uuid");
    mockSave.mockRejectedValue(mockError);

    // Act & Assert
    await expect(createLink(input)).rejects.toThrow("Database error");
  });
});
