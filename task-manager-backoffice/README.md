# 🅰️ Task Manager Backoffice - Angular 19 Dashboard

[![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.101.4-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![Angular CDK](https://img.shields.io/badge/Angular_CDK-19.2.19-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://material.angular.io/cdk/categories)
[![Karma](https://img.shields.io/badge/Karma-6.4.0-35B990?style=for-the-badge&logo=karma&logoColor=white)](https://karma-runner.github.io/)
[![Jasmine](https://img.shields.io/badge/Jasmine-5.6.0-8A4182?style=for-the-badge&logo=jasmine&logoColor=white)](https://jasmine.github.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A modern, high-performance Administration & Backoffice Dashboard for **TaskManager System**. Built with **Angular 19**, **TypeScript**, **Tailwind CSS v4**, and **TanStack Angular Query**, featuring **Standalone Components**, **Zoneless Event Coalescing**, reactive **Signals**, functional HTTP interceptors, functional route guards (`CanMatch`, `CanActivate`), an atomic UI design system, and an automated Continuous Deployment pipeline to **Vercel**.

---

## 📖 Core Features & Capabilities

- **User Management (Enterprise CRUD)**:
  - Tabular list view with pagination, search query debouncing, role filtering (`ADMIN`, `USER`), and active status indicators.
  - Interactive modal workflows for creating, editing, and deleting users.
  - Server state management, caching, and automatic query invalidation powered by **TanStack Angular Query**.
- **Task Lifecycle & Workflow Monitoring**:
  - Operational dashboard for system tasks with real-time summary statistics cards (Total Tasks, Pending, In Progress, Completed).
  - Advanced filtering by keyword, execution status (`PENDING`, `IN_PROGRESS`, `COMPLETED`), and priority (`LOW`, `MEDIUM`, `HIGH`).
  - Unified modal workflow for task creation and editing (`TaskFormModalComponent`).
  - Safe deletion confirmations with instant reactive cache updates.
- **Security & Role-Based Access Control (RBAC)**:
  - Dedicated Administrator login interface (`/auth/login`) with credential validation and token storage (`access_token`, `refresh_token`).
  - Functional route guards: `authGuard` prevents authenticated users from revisiting guest views, and `dashboardGuard` enforces Admin privileges (`admin@taskmanager.com`) with automatic session resynchronization via `/users/me`.
  - Functional HTTP interceptors (`jwtInterceptor`) injecting Bearer JWT tokens dynamically into outbound API requests.
- **Centralized Error & Notification Management**:
  - Functional `errorInterceptor` with granular error classification (Network/CORS, structured backend validation field errors, and fallback messaging).
  - Lightweight, SSR-safe `ToastService` supporting animated toast notifications and programmatic confirmation popups (`toast.confirm()`).
- **Atomic UI Design System**:
  - Standalone, highly reusable UI components in `src/app/shared/components/ui`:
    - **Atoms**: `ButtonComponent`, `BadgeComponent`, `InputComponent`, `SelectComponent`, `TextareaComponent`, `CheckboxComponent`, `AvatarComponent`, `ProgressBarComponent`.
    - **Molecules**: `FormFieldComponent`, `SearchInputComponent`, `StatCardComponent`, `ModalComponent`, `PaginationComponent`.
  - Strict `ChangeDetectionStrategy.OnPush` across 100% of components for maximum runtime performance.
- **Global Layout & Navigation**:
  - Modern dark-themed backoffice layout (`BackofficeLayoutComponent`) with collapsible/responsive Sidebar, Topbar with dynamic breadcrumb trail (`BreadcrumbsService`), user profile quick-view, and logout trigger.

---

## 🌐 Multi-Environment Architecture

The Backoffice supports 3 isolated environment targets through native Angular `fileReplacements`:

| Environment     | Configuration File           | Target Backend API URL                                   | Command                |
| :-------------- | :--------------------------- | :------------------------------------------------------- | :--------------------- |
| **Local**       | `environment.local.ts`       | `http://localhost:8080/api/v1`                           | `pnpm run start:local` |
| **Development** | `environment.development.ts` | `https://task-manager-api-dev-cgwm.onrender.com/api/v1`  | `pnpm run start:dev`   |
| **Production**  | `environment.ts`             | `https://task-manager-api-prod-j45b.onrender.com/api/v1` | `pnpm run start:prod`  |

---

## 🚀 Runtime Flow & State Architecture

```mermaid
graph TD
    User([👤 Admin Action]) --> UI[Atomic UI Components]
    UI --> Page[Users / Tasks Dashboard Pages]
    Page --> TanStack[TanStack Query Hooks / Client]
    TanStack --> Service[Feature Services (UserService / TaskService)]
    Service --> HttpClient[Angular HttpClient]

    subgraph "Interceptors & Security Layer"
        HttpClient --> JwtInt[jwtInterceptor: Inject Bearer JWT]
        JwtInt --> Backend[(Spring Boot REST API)]
        Backend --> ErrInt[errorInterceptor: Error Handling]
        ErrInt -- Success (200 OK) --> TanStack
        ErrInt -- Error / Validation --> ToastSvc[ToastService: Notifications / Alerts]
    end

    subgraph "Routing & Access Control"
        Router([🧭 Angular Router]) --> AuthGuard[authGuard: CanMatch]
        Router --> DashGuard[dashboardGuard: CanActivate & RBAC]
        DashGuard -- Verified Admin --> Layout[BackofficeLayoutComponent]
        DashGuard -- Unauthorized / Token Missing --> LoginRedirect[/auth/login]
    end
```

---

## 📁 Directory Structure

```text
task-manager-backoffice/
├── angular.json                       # Angular CLI multi-environment workspace configuration
├── eslint.config.js                   # Flat ESLint 10 + TypeScript ESLint rules
├── karma.conf.cjs                     # Karma test runner & ChromeHeadlessCI setup
├── package.json                       # Dependencies, scripts and metadata
├── pnpm-lock.yaml                     # Deterministic lockfile
├── vercel.json                        # Vercel SPA routing rewrite rules
├── Dockerfile                         # Containerized Node 22 Alpine dev setup
├── src/
│   ├── index.html                     # HTML5 entrypoint
│   ├── main.ts                        # Application bootstrap
│   ├── styles.css                     # Global styles & Tailwind CSS v4 directives
│   ├── environments/                  # Multi-environment target endpoints
│   │   ├── environment.local.ts       # Local Docker / localhost backend
│   │   ├── environment.development.ts # Render Dev backend
│   │   └── environment.ts             # Render Prod backend
│   └── app/
│       ├── app.component.ts           # Root application component
│       ├── app.config.ts              # Global providers (Router, Interceptors, TanStack Query)
│       ├── core/                      # Singleton global services, guards & interceptors
│       │   ├── guards/                # Functional route protection guards (auth, dashboard)
│       │   ├── interceptors/          # Functional HTTP interceptors (jwt, error)
│       │   └── services/              # Auth & API core services
│       ├── features/                  # Backoffice Domain Features
│       │   ├── auth/                  # Admin Login page, forms & test suites
│       │   ├── dashboard/             # Core Admin Layout, Sidebar, Topbar, Breadcrumbs
│       │   ├── tasks/                 # Task monitoring, filters, stats, modals & tests
│       │   └── users/                 # User CRUD, role management, modals & tests
│       └── shared/                    # Atomic UI Design System & Reusable Utilities
│           ├── components/ui/         # Standalone Atoms & Molecules (100% OnPush)
│           ├── services/              # ToastService, StorageService, BreadcrumbsService
│           └── utils/                 # cleanParams, downloadFile helper utilities
```

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
pnpm install

# Start development servers against different environments
pnpm run start:local        # Points to http://localhost:8080/api/v1
pnpm run start:dev          # Points to Render Dev API
pnpm run start:prod         # Points to Render Prod API

# Run unit tests (164 tests, 98%+ coverage)
pnpm run test:unit

# Run unit tests in watch mode
pnpm run test:unit:watch

# Generate code coverage report
pnpm run test:coverage

# Static quality checks
pnpm run typecheck          # Strict TypeScript compilation check
pnpm run lint               # Run ESLint across TypeScript & HTML templates
pnpm run format:check       # Check Prettier formatting
pnpm run format:write       # Auto-format all files

# Builds
pnpm run build:dev          # Build bundle with Development environment
pnpm run build:prod         # Build bundle with Production environment
```

---

## 🚀 Continuous Deployment to Vercel (`ci-cd-backoffice.yml`)

The Backoffice is automatically deployed to **Vercel** with strict Quality Gates:

1. **Quality Gates**:
   - `Fast-Fail Static Checks`: Prettier, ESLint, and `tsc --noEmit`.
   - `Unit Tests`: Executes 164 unit tests with ChromeHeadlessCI (98%+ coverage required).
   - `Production Build`: Compiles Angular with production optimizations.
   - `SonarCloud Scan`: Verifies code maintainability and test coverage.
2. **Automated Deployments**:
   - **Pull Requests**: Deploys a **Preview URL** connected to the Dev backend and comments the preview link directly on the PR.
   - **`main` Branch**: Deploys directly to the **Production URL** on Vercel connected to the Production backend.
3. **SPA Routing**: `vercel.json` ensures all Angular deep links (`/dashboard/users`, `/dashboard/tasks`) are correctly rewritten to `/index.html`.
