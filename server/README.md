# Link Shorter — Server

The backend API for the Link Shorter project. Built with **Fastify** and **TypeScript**, it provides a REST API for creating, retrieving, and deleting shortened links, as well as a **WebSocket** endpoint for real-time access count updates.

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Fastify 5
- **ORM:** Prisma 7 (PostgreSQL)
- **Language:** TypeScript 5
- **Validation:** Zod 4
- **Testing:** Jest 30
- **API Docs:** Swagger (via `@fastify/swagger`)
- **Infrastructure:** Pulumi (AWS)

## Project Structure

```
server/
├── src/
│   ├── controller/       # Route handlers (create, delete, find links)
│   ├── use-case/         # Business logic layer
│   ├── repository/       # Data access layer (Prisma)
│   ├── interfaces/       # TypeScript interfaces and types
│   ├── lib/              # Shared utilities (Prisma client, event emitter)
│   ├── helpers/          # Helper functions (e.g. slug validation)
│   ├── errors/           # Custom domain error classes
│   ├── events/           # Event listeners (e.g. link-accessed)
│   ├── plugins/          # Fastify plugins (Swagger, WebSocket)
│   ├── __tests__/        # Unit, integration, and e2e tests
│   └── server.ts         # Application entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Prisma migration files
├── infra/                # Pulumi IaC (AWS resources)
├── Dockerfile            # Multi-stage Docker build
└── package.json
```

## Architecture

The server follows a layered architecture:

```
Request
  │
  ▼
Controller        ← validates input with Zod, calls use-case
  │
  ▼
Use Case          ← business logic, orchestrates repositories and events
  │
  ▼
Repository        ← data access, wraps Prisma client
  │
  ▼
PostgreSQL
```

An **event-driven** approach is used to decouple side effects. When a short link is accessed, a `link-accessed` event is emitted. A listener increments the `accessCount` in the database and broadcasts the update to all connected WebSocket clients.

## Database Schema

```prisma
model Link {
  id          String   @id @default(uuid_v7())
  link        String   @db.Text
  shortLink   String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  accessCount Int      @default(0)
}
```

## API Endpoints

Interactive API documentation is available at `http://localhost:3333/docs` (Swagger UI) when running locally.

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/links` | Create a shortened link |
| `GET` | `/links` | List all links |
| `DELETE` | `/links/:id` | Delete a link |
| `GET` | `/:shortLink` | Redirect to the original URL |
| `WS` | `/ws` | WebSocket for real-time access count updates |

## Environment Variables

Copy `.env.example` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3333` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/link_shorter` |
| `FRONTEND_BASE_URL` | Frontend origin for CORS and redirect | `http://localhost:3001` |

## Getting Started

### With Docker Compose (recommended)

```bash
# Start all services (postgres + api)
docker-compose up

# Or start only the database
docker-compose up postgres -d
```

### Manually

```bash
# Install dependencies
yarn install

# Start the database
yarn docker:up

# Apply migrations
yarn prisma:migrate

# Start the dev server (with hot-reload)
yarn dev
```

The server will be available at `http://localhost:3333`.

## Available Scripts

| Script | Description |
|---|---|
| `yarn dev` | Start development server with hot-reload |
| `yarn build` | Compile TypeScript to `dist/` |
| `yarn start` | Run compiled production server |
| `yarn test` | Run all tests sequentially |
| `yarn prisma:migrate` | Apply pending database migrations |
| `yarn docker:up` | Start Docker services |
| `yarn docker:down` | Stop Docker services |

## Testing

The project has three levels of automated tests:

- **Unit tests** — test individual use-cases and helpers in isolation
- **Integration tests** — test repositories against a real PostgreSQL database (port 5433)
- **E2E tests** — test the full HTTP request/response cycle against a running server (port 5434)

Each test level uses its own isolated database, managed via Docker Compose:

```bash
# Start all test databases
docker-compose up postgres_test_integration postgres_test_e2e -d

# Run all tests
yarn test
```

## Deployment

The server is deployed to **AWS ECS Fargate** as a Docker container.

1. GitHub Actions builds and pushes the Docker image to **Amazon ECR**
2. The ECS task definition is updated with the new image
3. ECS performs a rolling deployment of the new task

Infrastructure is managed with **Pulumi** (`server/infra/`):

| File | Description |
|---|---|
| `vpc.ts` | VPC with public subnets |
| `ecr.ts` | Container registry |
| `ecs.ts` | ECS cluster, task definition, and service |
| `alb.ts` | Application Load Balancer |
| `security-groups.ts` | Security group rules |
| `iam.ts` | IAM roles and policies |
