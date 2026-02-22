import { DomainError } from "./domain.error";
import { HttpStatus } from "../utils/http-status.enum";

export class ValidationError extends DomainError {
  public readonly fieldErrors: Record<string, string[] | undefined>;

  constructor(fieldErrors: Record<string, string[] | undefined>) {
    super(HttpStatus.BAD_REQUEST, "Validation failed");
    this.fieldErrors = fieldErrors;
  }
}
