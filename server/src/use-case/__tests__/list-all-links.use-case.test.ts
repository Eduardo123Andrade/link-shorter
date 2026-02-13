import { listAllLinks } from "../list-all-links.use-case";
import { LinkShorterRepository } from "../../repository/link-shorter.repository";

jest.mock("../../repository/link-shorter.repository");

describe("listAllLinks", () => {
  const mockListAll = LinkShorterRepository.listAll as jest.MockedFunction<
    typeof LinkShorterRepository.listAll
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all links", async () => {
    // Arrange
    const mockLinks = [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        link: "https://www.example.com/1",
        shortLink: "link1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        link: "https://www.example.com/2",
        shortLink: "link2",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
    ];

    mockListAll.mockResolvedValue(mockLinks);

    // Act
    const result = await listAllLinks();

    // Assert
    expect(mockListAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockLinks);
    expect(result).toHaveLength(2);
  });

  it("should return empty array when no links exist", async () => {
    // Arrange
    mockListAll.mockResolvedValue([]);

    // Act
    const result = await listAllLinks();

    // Assert
    expect(mockListAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it("should propagate errors from repository", async () => {
    // Arrange
    const mockError = new Error("Database error");
    mockListAll.mockRejectedValue(mockError);

    // Act & Assert
    await expect(listAllLinks()).rejects.toThrow("Database error");
  });
});
