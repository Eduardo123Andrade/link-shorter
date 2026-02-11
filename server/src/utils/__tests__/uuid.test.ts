import { generateUuid } from "../uuid";

// Regex para validar formato UUID (8-4-4-4-12)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("generateUuid", () => {
  it("should generate a valid UUID v7 by default", () => {
    const uuid = generateUuid();

    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe("string");
    expect(uuid).toMatch(UUID_REGEX);
  });

  it("should generate a valid UUID v7 when explicitly specified", () => {
    const uuid = generateUuid("v7");

    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe("string");
    expect(uuid).toMatch(UUID_REGEX);
  });

  it("should generate a valid UUID v4 when specified", () => {
    const uuid = generateUuid("v4");

    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe("string");
    expect(uuid).toMatch(UUID_REGEX);
  });

  it("should generate different UUIDs on each call", () => {
    const uuid1 = generateUuid();
    const uuid2 = generateUuid();

    expect(uuid1).not.toBe(uuid2);
  });

  it("should generate UUID in correct format (8-4-4-4-12)", () => {
    const uuid = generateUuid();

    expect(uuid).toMatch(UUID_REGEX);
  });

  it("should generate different UUIDs when called multiple times", () => {
    const uuids = new Set();
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      uuids.add(generateUuid());
    }

    expect(uuids.size).toBe(iterations);
  });

  it("should generate v4 UUIDs that are different from v7 UUIDs", () => {
    const uuidV4 = generateUuid("v4");
    const uuidV7 = generateUuid("v7");

    expect(uuidV4).not.toBe(uuidV7);
    expect(uuidV4).toMatch(UUID_REGEX);
    expect(uuidV7).toMatch(UUID_REGEX);
  });
});
