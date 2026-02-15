import { FastifyRequest, FastifyReply } from "fastify";

export const mockReply = () => {
  const reply = {
    status: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
  } as unknown as FastifyReply;

  return reply;
};

export const mockRequest = (overrides: Partial<FastifyRequest> = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    protocol: "http",
    hostname: "localhost:3333",
    ...overrides,
  } as unknown as FastifyRequest;
};
