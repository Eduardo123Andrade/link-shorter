import { DomainError } from "../../errors/domain.error";

describe("DomainError", () => {
  it("should create an error with status code and message", () => {
    const error = new DomainError(400, "Bad Request");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Bad Request");
    expect(error.name).toBe("DomainError");
  });

  it("should have a stack trace", () => {
    const error = new DomainError(500, "Internal Server Error");

    expect(error.stack).toBeDefined();
  });

  it("should be catchable as Error", () => {
    try {
      throw new DomainError(403, "Forbidden");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
    }
  });
});
