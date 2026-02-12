import { ERROR_MESSAGES } from "../utils/constants";
import { NotFoundError } from "./not-found.error";

export class LinkNotFoundError extends NotFoundError {
  constructor(message: string = ERROR_MESSAGES.LINK_NOT_FOUND) {
    super(message);
  }
}
