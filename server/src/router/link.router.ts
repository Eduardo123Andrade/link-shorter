import { FastifyInstance } from "fastify";
import {
  createLinkController,
  findLinkByShortLinkController,
  listAllLinksController,
  deleteLinkController,
} from "../controller";

export async function linkRouter(app: FastifyInstance) {
  app.post("/links", createLinkController);
  app.get("/links", listAllLinksController);
  app.delete("/links/:id", deleteLinkController);
  app.get("/:shortLink", findLinkByShortLinkController);
}
