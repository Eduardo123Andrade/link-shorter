import { uuidv7, uuidv4 } from "uuidv7";

export type UuidVersion = "v4" | "v7";

export const generateUuid = (version: UuidVersion = "v7"): string => {
  if (version === "v4") {
    return uuidv4();
  }

  return uuidv7();
};
