import { DomainError } from "./domain.error";
import { HttpStatus } from "../utils";
import { ERROR_MESSAGES } from "../utils/constants";

export class LinkAlreadyExistsError extends DomainError {
  constructor() {
    super(HttpStatus.CONFLICT, ERROR_MESSAGES.LINK_ALREADY_EXISTS);
  }
}
