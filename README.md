# 🪐 Task Manager System - Enterprise Full-Stack Ecosystem

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

A modern, production-grade enterprise task management platform engineered for maximum reliability, speed, and clean architectural maintainability. Features a **Spring Boot 3 / Java 21** RESTful API, a **React 19 / Vite** client SPA, and an **Angular 19** Backoffice administration dashboard, backed by **Neon PostgreSQL**, **Docker**, and strict **CI/CD Quality Gates**.

---

## 🏛️ Ecosystem Architecture & Subprojects

The repository is structured as a unified monorepo housing three specialized application tiers and cross-cutting automation:

| Subproject | Description | Stack & Ports | Cloud Hosting & CD | Documentation |
| :--- | :--- | :--- | :--- | :--- |
| **`task-manager/`** | RESTful Backend API (Hexagonal Architecture, DDD, JWT Auth, Bucket4j Rate Limiting, OpenAPI). | Java 21, Spring Boot 3, PostgreSQL<br>`Port: 8080` | **Render Cloud** (Dev & Prod Hooks)<br>Database: **Neon.tech** | [Backend Docs](file:///Users/diegovilla/Desktop/task-manager-system/task-manager/README.md) |
| **`task-manager-client/`** | User-facing SPA with drag-and-drop Kanban board, filters, atomic UI design system, and JWT lifecycle. | React 19, Vite, Tailwind CSS v4, Vitest<br>`Port: 3000` | Static / Container ready | [Client Docs](file:///Users/diegovilla/Desktop/task-manager-system/task-manager-client/README.md) |
| **`task-manager-backoffice/`** | Admin Dashboard for user management (CRUD) and task analytics with TanStack Angular Query & Signals. | Angular 19, TypeScript, Tailwind CSS v4, Karma<br>`Port: 4200` | **Vercel** (Automatic Previews on PRs & Prod on `main`) | [Backoffice Docs](file:///Users/diegovilla/Desktop/task-manager-system/task-manager-backoffice/README.md) |

---

## 🚀 Full-Stack Architectural Runtime

```mermaid
flowchart TB
    subgraph Users ["Client Applications"]
        ClientApp["📱 React 19 Client SPA<br/>(Kanban & User Tasks)<br/>Port: 3000"]
        BackofficeApp["💼 Angular 19 Backoffice<br/>(User CRUD & Metrics)<br/>Port: 4200 / Vercel"]
    end

    subgraph BackendTier ["Backend API Tier (Render Cloud / Docker)"]
        CORS["CorsConfigurationFilter<br/>(localhost, *.vercel.app, *.onrender.com)"]
        RateLimit["Bucket4j RateLimiter (100 req/min)"]
        Security["JwtAuthenticationFilter & RBAC"]
        Controllers["REST Controllers (Auth, Task, User)"]
        Services["Domain & Application Services"]
        JPA["Spring Data JPA & Specifications"]

        CORS --> RateLimit --> Security --> Controllers --> Services --> JPA
    end

    subgraph DataTier ["Persistence Tier (Neon.tech / PostgreSQL)"]
        NeonDev[(Neon PostgreSQL - dev branch)]
        NeonProd[(Neon PostgreSQL - main branch)]
    end

    ClientApp -- "HTTP REST / Bearer JWT" --> CORS
    BackofficeApp -- "HTTP REST / Bearer JWT" --> CORS
    JPA -.-> NeonDev
    JPA -.-> NeonProd
```

---

## 📁 Repository Directory Structure

```text
task-manager-system/
├── .github/
│   ├── workflows/
│   │   ├── ci-cd-backend.yml           # Backend CI/CD (Quality Gate + Render Deploy Hooks)
│   │   └── ci-cd-backoffice.yml        # Angular CI/CD (Quality Gate + Vercel CD Deploy)
│   └── scripts/
│       └── notify-discord-summary.js   # Single consolidated Discord notification webhook
├── .husky/                             # Git pre-commit & pre-push hooks
├── .commitlintrc.json                  # Conventional Commits commit-msg validator
├── .lintstagedrc.js                    # Lint-staged runner for Prettier, ESLint & Spotless
├── docker-compose.yml                  # Multi-container local orchestration (Backend + React + Angular)
├── package.json                        # Monorepo root scripts & dev dependencies
├── README.md                           # System root documentation
│
├── task-manager/                       # 🟢 Spring Boot Backend API
│   ├── pom.xml
│   ├── Dockerfile
│   ├── README.md
│   └── src/main/java/...               # Core (Security, CORS, JWT, OpenAPI), Features (Auth, Task, User)
│
├── task-manager-client/                # 🔵 React 19 Frontend Client SPA
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   ├── README.md
│   └── src/                            # Kanban, Auth, Tasks, Atomic UI components
│
└── task-manager-backoffice/            # 🅰️ Angular 19 Backoffice Dashboard
    ├── angular.json                    # Multi-environment build configurations
    ├── package.json
    ├── vercel.json                     # SPA routing rewrite rules for Vercel
    ├── Dockerfile
    ├── README.md
    └── src/                            # Standalone Components, TanStack Query, Signals, Environments
```

---

## 🐳 Local Development with Docker Compose

Run the entire ecosystem (Backend API, React Client, Angular Backoffice) with a single command:

```bash
# 1. Create external shared Docker network (if not existing)
docker network create shared-network || true

# 2. Build and launch all 3 micro-services in the background
docker compose up -d --build
```

### Active Service Endpoints:

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Spring Boot API** | [http://localhost:8080/api/v1](http://localhost:8080/api/v1) | Backend REST API |
| **Swagger UI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive OpenAPI Documentation |
| **React Client** | [http://localhost:3000](http://localhost:3000) | Task Manager Client SPA |
| **Angular Backoffice** | [http://localhost:4200](http://localhost:4200) | Admin Backoffice Dashboard |

---

## 🛡️ GitFlow, Rulesets & Branching Strategy

The repository strictly enforces automated Quality Gates via GitHub Rulesets to prevent regressions:

```mermaid
gitGraph
    commit id: "Initial"
    branch dev
    checkout dev
    commit id: "feat: user-api"
    branch feat/auth
    checkout feat/auth
    commit id: "feat: login"
    commit id: "test: auth-tests"
    checkout dev
    merge feat/auth id: "Squash & Merge (#41)"
    checkout main
    merge dev id: "Release: Merge Commit (#42)" tag: "v1.0.0"
```

### Rulesets Configuration:

1. **`dev` (Development Branch):**
   - Direct push blocked.
   - Merge strategy: **Squash and Merge** (keeps history atomic and clean).
   - Mandatory CI Quality Gates (Format, Lint, Tests, SonarCloud).
2. **`main` (Production Branch):**
   - Direct push blocked.
   - Merge strategy: **Create a Merge Commit** (preserves genealogy and avoids conflict divergence).
   - Mandatory CI/CD Quality Gates + Automatic Cloud Deployments.

---

## ⚡ Continuous Integration & Deployment (CI/CD)

Every Pull Request and Push is evaluated through strict Quality Gates before code can be merged or deployed:

### 1. Backend Pipeline (`ci-cd-backend.yml`):
- **Checks:** Spotless Google Java Format, Maven compile, 57+ Unit & Domain Tests, SonarCloud Quality Gate.
- **Continuous Deployment (CD):** Calls Render Deploy Webhooks (`RENDER_DEPLOY_HOOK_DEV` on `dev`, `RENDER_DEPLOY_HOOK_PROD` on `main`).

### 2. Angular Backoffice Pipeline (`ci-cd-backoffice.yml`):
- **Checks:** Prettier, ESLint, TypeScript typecheck, 164 Jasmine/Karma unit tests (98%+ coverage), Production build verification, SonarCloud Quality Gate.
- **Continuous Deployment (CD):** Deploys to **Vercel** (Dynamic Preview URL on PRs, Production Deployment on `main`).

### 3. Consolidated Discord Notifications:
- Every pipeline execution sends a single, rich embedded summary card to Discord reporting the status of every Quality Gate check and cloud deployment.

---

## 🛠️ Root Workspace Scripts

Run standard commands from the repository root:

```bash
# Code Quality & Format Checks
pnpm run format:check      # Check formatting across all subprojects
pnpm run format:write      # Auto-format all TS/HTML/CSS/JSON/Java files
pnpm run lint              # Run ESLint across frontends

# Clean local orphaned Git branches
./git-prune-branches.sh
```

---

## 📄 License

This project is licensed under the MIT License.
