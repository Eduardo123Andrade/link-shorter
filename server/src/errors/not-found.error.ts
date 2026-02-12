import { HttpStatus } from "../utils/http-status.enum";
import { DomainError } from "./domain.error";

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, message);
  }
}
