# Link Shorter

A full-stack URL shortening service built as part of the **Rocketseat Post-Graduation Program**. The application allows users to create, manage, and track shortened links with real-time access count updates via WebSocket.

## About

This project was developed as a practical assignment for the Rocketseat post-graduation program, exploring modern full-stack development practices including cloud infrastructure, CI/CD pipelines, containerization, and scalable architecture on AWS.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     AWS Cloud                       │
│                                                     │
│  ┌──────────┐     ┌─────┐     ┌──────────────────┐  │
│  │  S3 SPA  │────▶│ ALB │────▶│  ECS (Fargate)   │  │
│  │  (web)   │     └─────┘     │  Fastify API      │  │
│  └──────────┘                 └────────┬─────────┘  │
│                                        │             │
│                               ┌────────▼─────────┐  │
│                               │    PostgreSQL     │  │
│                               └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

- **Frontend (web):** Next.js static SPA deployed to AWS S3
- **Backend (server):** Fastify REST API deployed to AWS ECS Fargate
- **Database:** PostgreSQL managed via Prisma ORM
- **Infrastructure:** AWS resources provisioned with Pulumi (IaC)

## Monorepo Structure

```
link-shorter/
├── server/          # Fastify REST API (Node.js + TypeScript)
├── web/             # Next.js SPA (React + TypeScript)
├── docker-compose.yml
└── .github/
    └── workflows/   # CI/CD pipelines
```

See [`server/README.md`](./server/README.md) and [`web/README.md`](./web/README.md) for detailed documentation on each package.

## Getting Started

### Prerequisites

- Node.js 22+
- Docker and Docker Compose
- Yarn

### Running Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd link-shorter
   ```

2. Start the database:
   ```bash
   docker-compose up postgres -d
   ```

3. Start the server (see [server/README.md](./server/README.md)):
   ```bash
   cd server
   cp .env.example .env
   yarn install
   yarn prisma:migrate
   yarn dev
   ```

4. Start the web app (see [web/README.md](./web/README.md)):
   ```bash
   cd web
   yarn install
   yarn dev
   ```

## CI/CD Pipeline

This project uses **GitHub Actions** for automated testing, building, and deployment. The pipeline is path-aware — only the affected parts of the monorepo are built and deployed on each push.

### Workflow Overview

```
push to main/dev
       │
       ▼
  ci.yaml (orchestrator)
  ├── detects changed paths
  ├── server/** ──▶ server-ci.yaml ──▶ server-deploy.yaml
  ├── server/infra/** ──▶ server-infra.yaml
  └── web/** ──▶ web-ci.yaml ──▶ web-deploy.yaml
```

### Pipelines

| Workflow | Description |
|---|---|
| `ci.yaml` | Master orchestrator — detects changes and triggers the relevant sub-workflows |
| `server-ci.yaml` | Lint, unit tests, integration tests, e2e tests, Docker build |
| `server-deploy.yaml` | Pushes Docker image to ECR and deploys to ECS |
| `server-infra.yaml` | Applies Pulumi infrastructure changes to AWS |
| `web-ci.yaml` | Lint and static Next.js export build |
| `web-deploy.yaml` | Syncs static build to S3 |

### Environments

- **`main` branch** — Development environment (Temporary/Testing)
- **`dev` branch** — Development environment

Concurrency is configured per branch, so in-progress runs are cancelled when a new push arrives.

## Infrastructure (AWS + Pulumi)

Infrastructure is defined as code using **Pulumi (TypeScript)** and lives in `server/infra/`.

| Resource | Description |
|---|---|
| VPC | Isolated network (10.0.0.0/16) with 3 public subnets |
| ECR | Container registry for the API Docker image |
| ECS (Fargate) | Serverless container running the Fastify API |
| ALB | Application Load Balancer routing traffic to ECS |
| S3 | Static website hosting for the Next.js SPA |
| Security Groups | Network access rules for ALB and ECS |
| IAM | Roles and policies for ECS task execution |

### Pulumi Backend — AWS S3 instead of Pulumi Cloud

By design, this project does **not** use Pulumi Cloud as its state backend. Instead, state is stored directly in an **AWS S3 bucket**, and authentication is handled entirely via AWS credentials. This avoids a dependency on a third-party SaaS platform and keeps the infrastructure self-contained within AWS.

To support this, `server/infra/Pulumi.dev.yaml` was modified to include an `encryptionsalt`, which allows Pulumi to encrypt secrets locally without needing the Pulumi Cloud token.

```yaml
# server/infra/Pulumi.dev.yaml
config:
  aws:region: us-east-2
encryptionsalt: v1:...
```

The CI/CD pipeline is already configured to authenticate using `PULUMI_BACKEND_URL` (pointing to the S3 bucket) and `PULUMI_CONFIG_PASSPHRASE` (used to derive the encryption key).

**To test infrastructure locally:**

1. Remove the `encryptionsalt` line from `Pulumi.dev.yaml`
2. Log in to Pulumi using your S3 backend:
   ```bash
   pulumi login s3://<your-bucket-name>
   ```
3. Set the passphrase and run:
   ```bash
   export PULUMI_CONFIG_PASSPHRASE=your-passphrase
   cd server/infra
   pulumi up --stack dev
   ```

## Environment Variables (GitHub Actions Secrets)

The project was designed with the assumption that **if you own a domain, the service URLs are known in advance** — the ALB DNS for the API and the S3 URL for the frontend are predictable once the infrastructure is provisioned. This means all environment variables can be defined upfront as GitHub Actions secrets before the first deployment.

### Required Secrets

| Secret | Description | Example |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `wJalrXUtn...` |
| `AWS_REGION` | AWS region for all resources | `us-east-2` |
| `PULUMI_BACKEND_URL` | S3 URL for Pulumi state storage | `s3://my-pulumi-state-bucket` |
| `PULUMI_CONFIG_PASSPHRASE` | Passphrase for Pulumi secret encryption | `my-passphrase` |
| `PORT` | Port the Fastify server listens on | `3333` |
| `DATABASE_URL` | PostgreSQL connection string for the API | `postgresql://user:pass@host:5432/db` |
| `FRONTEND_BASE_URL` | Frontend origin (used for CORS and redirects) | `https://myapp.com` |
| `NEXT_PUBLIC_API_URL` | Public API URL used by the Next.js frontend | `https://api.myapp.com` |

> **Note:** `FRONTEND_BASE_URL` and `NEXT_PUBLIC_API_URL` refer to the same service from different perspectives — one is consumed by the server (CORS/redirect origin), the other is baked into the frontend bundle at build time. With a custom domain, both values are known before deployment and can be set as secrets from day one.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 22, Fastify 5, Prisma 7, TypeScript, Zod |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Zustand, react-hook-form |
| Database | PostgreSQL |
| Infrastructure | AWS (ECS, ECR, S3, ALB, VPC), Pulumi |
| CI/CD | GitHub Actions |
| Containerization | Docker, Docker Compose |
| Testing | Jest (unit, integration, e2e) |
