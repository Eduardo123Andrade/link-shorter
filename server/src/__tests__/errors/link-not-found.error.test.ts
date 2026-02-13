import { LinkNotFoundError } from "../../errors/link-not-found.error";
import { NotFoundError } from "../../errors/not-found.error";
import { DomainError } from "../../errors/domain.error";
import { ERROR_MESSAGES } from "../../utils/constants";

describe("LinkNotFoundError", () => {
  it("should create error with default message", () => {
    const error = new LinkNotFoundError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error).toBeInstanceOf(LinkNotFoundError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe(ERROR_MESSAGES.LINK_NOT_FOUND);
    expect(error.name).toBe("LinkNotFoundError");
  });

  it("should create error with custom message", () => {
    const customMessage = "Custom link not found message";
    const error = new LinkNotFoundError(customMessage);

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe(customMessage);
  });

  it("should have correct inheritance chain", () => {
    const error = new LinkNotFoundError();

    expect(error instanceof LinkNotFoundError).toBe(true);
    expect(error instanceof NotFoundError).toBe(true);
    expect(error instanceof DomainError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });
});
