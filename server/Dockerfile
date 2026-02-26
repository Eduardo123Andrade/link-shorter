# Stage 1: Install production dependencies only
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

# Stage 2: Build (install all deps, compile TS)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 3: Production image (lean, no dev dependencies, no source)
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Copy Drizzle migrations (needed at runtime for migrate.js)
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3000

CMD ["sh", "-c", "node dist/migrate.js && node dist/server.js"]
