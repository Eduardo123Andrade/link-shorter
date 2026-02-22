# Stage 1: Install production dependencies only
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

# Stage 2: Build (install all deps, generate prisma client, compile TS)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile
RUN yarn prisma:generate

COPY . .
RUN yarn build

# Stage 3: Production image (lean, no dev dependencies, no source)
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Override with the prisma generated client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy prisma schema and config (needed at runtime for migrations)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
