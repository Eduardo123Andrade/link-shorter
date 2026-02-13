import { LinkShorterRepository } from "../../repository/link-shorter.repository";
import { cleanDatabase, disconnectDatabase } from "../setup/test-helpers";
import { uuidv7 } from "uuidv7";

describe("LinkShorterRepository", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  describe("save", () => {
    it("should save a new link successfully", async () => {
      // Arrange
      const linkData = {
        id: uuidv7(),
        link: "https://www.example.com/very-long-url",
        shortLink: "abc123",
      };

      // Act
      const result = await LinkShorterRepository.save(linkData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(linkData.id);
      expect(result.link).toBe(linkData.link);
      expect(result.shortLink).toBe(linkData.shortLink);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it("should throw error when saving duplicate shortLink", async () => {
      // Arrange
      const linkData1 = {
        id: uuidv7(),
        link: "https://www.example.com/url1",
        shortLink: "abc123",
      };

      const linkData2 = {
        id: uuidv7(),
        link: "https://www.example.com/url2",
        shortLink: "abc123", // mesmo shortLink
      };

      await LinkShorterRepository.save(linkData1);

      // Act & Assert
      await expect(LinkShorterRepository.save(linkData2)).rejects.toThrow();
    });
  });

  describe("findById", () => {
    it("should find a link by id", async () => {
      // Arrange
      const linkData = {
        id: uuidv7(),
        link: "https://www.example.com/test",
        shortLink: "test123",
      };

      await LinkShorterRepository.save(linkData);

      // Act
      const result = await LinkShorterRepository.findById(linkData.id);

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(linkData.id);
      expect(result?.link).toBe(linkData.link);
      expect(result?.shortLink).toBe(linkData.shortLink);
    });

    it("should return null when link is not found", async () => {
      // Arrange
      const nonExistentId = uuidv7();

      // Act
      const result = await LinkShorterRepository.findById(nonExistentId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findByShortLink", () => {
    it("should find a link by shortLink", async () => {
      // Arrange
      const linkData = {
        id: uuidv7(),
        link: "https://www.example.com/test",
        shortLink: "short123",
      };

      await LinkShorterRepository.save(linkData);

      // Act
      const result = await LinkShorterRepository.findByShortLink(
        linkData.shortLink,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(linkData.id);
      expect(result?.link).toBe(linkData.link);
      expect(result?.shortLink).toBe(linkData.shortLink);
    });

    it("should return null when shortLink is not found", async () => {
      // Arrange
      const nonExistentShortLink = "nonexistent";

      // Act
      const result =
        await LinkShorterRepository.findByShortLink(nonExistentShortLink);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("listAll", () => {
    it("should return empty array when no links exist", async () => {
      // Act
      const result = await LinkShorterRepository.listAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("should return all links ordered by createdAt desc", async () => {
      // Arrange
      const link1 = {
        id: uuidv7(),
        link: "https://www.example.com/1",
        shortLink: "link1",
      };

      const link2 = {
        id: uuidv7(),
        link: "https://www.example.com/2",
        shortLink: "link2",
      };

      const link3 = {
        id: uuidv7(),
        link: "https://www.example.com/3",
        shortLink: "link3",
      };

      await LinkShorterRepository.save(link1);
      // Pequeno delay para garantir ordem diferente de createdAt
      await new Promise((resolve) => setTimeout(resolve, 10));
      await LinkShorterRepository.save(link2);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await LinkShorterRepository.save(link3);

      // Act
      const result = await LinkShorterRepository.listAll();

      // Assert
      expect(result).toHaveLength(3);
      // Deve estar ordenado por data de criação decrescente (mais recente primeiro)
      expect(result[0].shortLink).toBe("link3");
      expect(result[1].shortLink).toBe("link2");
      expect(result[2].shortLink).toBe("link1");
    });
  });

  describe("deleteById", () => {
    it("should delete a link by id", async () => {
      // Arrange
      const linkData = {
        id: uuidv7(),
        link: "https://www.example.com/delete",
        shortLink: "delete123",
      };

      await LinkShorterRepository.save(linkData);

      // Act
      const deleted = await LinkShorterRepository.deleteById(linkData.id);

      // Assert
      expect(deleted).toBeDefined();
      expect(deleted.id).toBe(linkData.id);

      // Verify it's actually deleted
      const found = await LinkShorterRepository.findById(linkData.id);
      expect(found).toBeNull();
    });

    it("should throw error when trying to delete non-existent link", async () => {
      // Arrange
      const nonExistentId = uuidv7();

      // Act & Assert
      await expect(
        LinkShorterRepository.deleteById(nonExistentId),
      ).rejects.toThrow();
    });

    it("should delete link and cascade delete related accesses", async () => {
      // Arrange
      const linkData = {
        id: uuidv7(),
        link: "https://www.example.com/cascade",
        shortLink: "cascade123",
      };

      const savedLink = await LinkShorterRepository.save(linkData);

      // Create related access using prisma directly
      const { prisma } = await import("../../lib/prisma");
      await prisma.linkAccess.create({
        data: {
          linkId: savedLink.id,
        },
      });

      // Verify access exists
      const accessesBefore = await prisma.linkAccess.findMany({
        where: { linkId: savedLink.id },
      });
      expect(accessesBefore).toHaveLength(1);

      // Act
      await LinkShorterRepository.deleteById(linkData.id);

      // Assert - accesses should be deleted due to cascade
      const accessesAfter = await prisma.linkAccess.findMany({
        where: { linkId: savedLink.id },
      });
      expect(accessesAfter).toHaveLength(0);
    });
  });
});
