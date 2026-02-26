import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createLinkController,
  findLinkByShortLinkController,
  listAllLinksController,
  deleteLinkController,
  generateLinkReportController,
} from "../controller";
import {
  createLinkSchema,
  shortLinkParamSchema,
  idParamSchema,
  linkResponseSchema,
  linkListResponseSchema,
  noContentResponseSchema,
  redirectResponseSchema,
  errorResponseSchema,
  reportResponseSchema,
} from "../schemas";

export async function linkRouter(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post("/links", {
    schema: {
      tags: ["Links"],
      summary: "Create a shortened link",
      body: createLinkSchema,
      response: {
        201: linkResponseSchema,
        400: errorResponseSchema,
      },
    },
    handler: createLinkController,
  });

  typedApp.get("/links", {
    schema: {
      tags: ["Links"],
      summary: "List all links",
      response: {
        200: linkListResponseSchema,
      },
    },
    handler: listAllLinksController,
  });

  typedApp.get("/links/report", {
    schema: {
      tags: ["Links"],
      summary: "Generate CSV report",
      description:
        "Generates a CSV file containing all shortened links with their metadata (id, original URL, short link, access count, created/updated dates). The file is stored and a download URL is returned. When using local storage the URL points to the server's `/tmp/*` route; in production it points to a CloudFront-served S3 object.",
      response: {
        200: reportResponseSchema,
        500: errorResponseSchema,
      },
    },
    handler: generateLinkReportController,
  });

  typedApp.delete("/links/:id", {
    schema: {
      tags: ["Links"],
      summary: "Delete a link by ID",
      params: idParamSchema,
      response: {
        204: noContentResponseSchema,
        400: errorResponseSchema,
      },
    },
    handler: deleteLinkController,
  });

  typedApp.get("/:shortLink", {
    schema: {
      tags: ["Links"],
      summary: "Redirect to original URL",
      params: shortLinkParamSchema,
      response: {
        302: redirectResponseSchema,
        400: errorResponseSchema,
      },
    },
    handler: findLinkByShortLinkController,
  });
}
