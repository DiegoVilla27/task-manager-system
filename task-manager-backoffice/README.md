# 🅰️ Task Manager Backoffice - Angular 19 Dashboard

[![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.101.4-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![Angular CDK](https://img.shields.io/badge/Angular_CDK-19.2.19-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://material.angular.io/cdk/categories)
[![Karma](https://img.shields.io/badge/Karma-6.4.0-35B990?style=for-the-badge&logo=karma&logoColor=white)](https://karma-runner.github.io/)
[![Jasmine](https://img.shields.io/badge/Jasmine-5.6.0-8A4182?style=for-the-badge&logo=jasmine&logoColor=white)](https://jasmine.github.io/)
[![ESLint](https://img.shields.io/badge/ESLint-10.8.1-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.9.6-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)

A modern, high-performance Administration & Backoffice Dashboard for **TaskManager System**. Built with **Angular 19**, **TypeScript**, **Tailwind CSS v4**, and **TanStack Angular Query**, featuring modern **Standalone Components**, **Zoneless Event Coalescing**, reactive **Signals**, functional HTTP interceptors, functional route guards (`CanMatch`, `CanActivate`), an atomic UI design system, and an extensive **Jasmine / Karma Headless CI** test suite.

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
├── angular.json                       # Angular CLI workspace configuration
├── eslint.config.js                   # Flat ESLint 10 + TypeScript ESLint rules
├── karma.conf.cjs                     # Karma test runner & ChromeHeadlessCI setup
├── package.json                       # Dependencies, scripts and metadata
├── pnpm-lock.yaml                     # Deterministic lockfile
├── postcss.config.json                # PostCSS 8 configuration
├── tsconfig.app.json                  # Application TypeScript compiler options
├── tsconfig.json                      # Root TypeScript configuration & path aliases
├── tsconfig.spec.json                 # Test TypeScript compiler configuration
├── src/
│   ├── index.html                     # HTML5 entrypoint
│   ├── main.ts                        # Application bootstrap (provideZoneChangeDetection)
│   ├── styles.css                     # Global styles & Tailwind CSS v4 directives
│   ├── environments/                  # Environment configurations
│   │   ├── environment.ts             # Production environment settings
│   │   └── environment.development.ts # Development environment settings
│   └── app/
│       ├── app.component.ts           # Root component
│       ├── app.component.html
│       ├── app.component.spec.ts
│       ├── app.config.ts              # Global providers (Router, Interceptors, TanStack Query)
│       ├── core/                      # Singleton global services, guards & interceptors
│       │   ├── guards/                # Functional route protection guards
│       │   │   ├── auth.guard.ts      # Guest route guard (CanMatch)
│       │   │   ├── auth.guard.spec.ts
│       │   │   ├── dashboard.guard.ts # RBAC Admin guard with /me resync (CanActivate)
│       │   │   └── dashboard.guard.spec.ts
│       │   ├── interceptors/          # Functional HTTP interceptors
│       │   │   ├── jwt.interceptor.ts # Outbound Bearer token injection
│       │   │   ├── jwt.interceptor.spec.ts
│       │   │   ├── error.interceptor.ts # Global error handling & toast dispatch
│       │   │   └── error.interceptor.spec.ts
│       │   ├── router/                # Root routing configuration
│       │   │   └── app.routes.ts      # Lazy-loaded route declarations
│       │   └── tanstack/              # TanStack Query Client configuration
│       │       ├── index.ts           # QueryClient factory (staleTime, retries)
│       │       └── tanstack.config.spec.ts
│       ├── features/                  # Self-contained feature modules
│       │   ├── auth/                  # Authentication module
│       │   │   ├── interfaces/        # Request & Response DTOs
│       │   │   ├── login/             # Login page & subcomponents
│       │   │   │   ├── login.component.ts
│       │   │   │   ├── login.component.spec.ts
│       │   │   │   └── components/    # Brand header & login form
│       │   │   ├── routes/            # Feature routing (auth.routes.ts)
│       │   │   └── services/          # AuthService (login, logout, token persistence)
│       │   └── dashboard/             # Dashboard backoffice module
│       │       ├── layout/            # Backoffice shell layout (Sidebar, Topbar, Footer)
│       │       │   ├── backoffice-layout.component.ts
│       │       │   ├── backoffice-layout.component.html
│       │       │   ├── backoffice-layout.component.scss
│       │       │   ├── backoffice-layout.component.spec.ts
│       │       │   └── components/    # Topbar, Sidebar, Footer components & tests
│       │       ├── pages/             # Routed feature views
│       │       │   ├── tasks/         # Task Management CRUD
│       │       │   │   ├── interfaces/# Task DTOs & pagination models
│       │       │   │   ├── services/  # TaskService HTTP communication
│       │       │   │   ├── tasks-list.component.ts
│       │       │   │   ├── tasks-list.component.html
│       │       │   │   ├── tasks-list.component.spec.ts
│       │       │   │   └── components/# Stats cards, filters, tables, form & delete modals
│       │       │   └── users/         # User Management CRUD
│       │       │       ├── interfaces/# User DTOs & pagination models
│       │       │       ├── services/  # UserService HTTP communication
│       │       │       ├── users-list.component.ts
│       │       │       ├── users-list.component.html
│       │       │       ├── users-list.component.spec.ts
│       │       │       └── components/# Headers, filters, tables, create/edit & delete modals
│       │       └── routes/            # Feature routing (dashboard.routes.ts)
│       └── shared/                    # Reusable components, utilities and services
│           ├── interfaces/            # Shared interfaces & pagination types
│           ├── services/              # ToastService, BreadcrumbsService
│           ├── utils/                 # cleanParams, StorageUtils, downloadFile
│           └── components/
│               └── ui/                # Modular Atomic UI Components
│                   ├── avatar/        # User avatar component & spec
│                   ├── badge/         # Status & role badge component & spec
│                   ├── button/        # Dynamic button component & spec
│                   ├── checkbox/      # Form checkbox component & spec
│                   ├── form-field/    # Form control wrapper component & spec
│                   ├── input/         # Input control component & spec
│                   ├── modal/         # Modal dialog container & spec
│                   ├── pagination/    # Pagination control component & spec
│                   ├── progress-bar/  # Progress indicator component & spec
│                   ├── search-input/  # Debounced search bar component & spec
│                   ├── select/        # Select dropdown component & spec
│                   ├── stat-card/     # Metrics summary card component & spec
│                   └── textarea/      # Multiline textarea component & spec
```

---

## 🛠️ Technical Stack & Dependencies

| Category                  | Library / Dependency                   | Version    | Purpose                                                |
| :------------------------ | :------------------------------------- | :--------- | :----------------------------------------------------- |
| **Framework**             | `@angular/core` & `@angular/common`    | `^19.2.0`  | Core Angular framework & runtime                       |
| **Language**              | `typescript`                           | `~5.7.2`   | Static type checking and modern ECMAScript compilation |
| **Build Tool & CLI**      | `@angular/cli` & `@angular-devkit/*`   | `^19.2.27` | Official build system, bundling, and tooling           |
| **Styling Engine**        | `tailwindcss` & `@tailwindcss/postcss` | `^4.3.3`   | Utility-first modern CSS engine (Tailwind CSS v4)      |
| **Component Kit**         | `@angular/cdk`                         | `^19.2.19` | Component Development Kit (Overlays, A11y, Portals)    |
| **Routing**               | `@angular/router`                      | `^19.2.0`  | Functional router with guards & View Transitions       |
| **Forms**                 | `@angular/forms`                       | `^19.2.0`  | Strongly-typed Reactive Forms                          |
| **State & Async Queries** | `@tanstack/angular-query-experimental` | `^5.101.4` | Server-state caching, synchronization & mutations      |
| **Reactive Extensions**   | `rxjs`                                 | `~7.8.0`   | Observable-based asynchronous stream handling          |
| **Icons**                 | `@lucide/angular`                      | `^1.31.0`  | Customizable modern SVG iconography                    |
| **Linter**                | `eslint` & `typescript-eslint`         | `^10.8.1`  | Static code analysis and Angular ESLint rules          |
| **Formatter**             | `prettier`                             | `^3.9.6`   | Automated code style enforcement                       |
| **Test Framework**        | `jasmine-core` & `@types/jasmine`      | `~5.6.0`   | BDD testing framework for JavaScript & TypeScript      |
| **Test Runner**           | `karma` & `karma-jasmine`              | `~6.4.0`   | Cross-browser test runner & harness                    |
| **Headless Browser**      | `karma-chrome-launcher`                | `~3.2.0`   | Headless Chrome browser integration for CI/CD          |
| **Code Coverage**         | `karma-coverage`                       | `~2.2.0`   | Code coverage reporter (HTML, LCOV, text summaries)    |

---

## ⚙️ Provisioning & Setup Guide

### 1. Prerequisites

- **Node.js**: v18.x or higher (v20+ recommended)
- **pnpm** (recommended) or **npm** installed

### 2. Environment Configuration

The application includes pre-configured environment files in `src/environments/` and an environment template:

Create a `.env` file in the root directory of `task-manager-backoffice/`:

```env
NODE_ENV=development
PORT=4200
API_URL=http://localhost:8080/api/v1
```

### 3. Installation & Development

```bash
# Install project dependencies
pnpm install

# Start Angular development server
pnpm start
# or
ng serve

# Build production-ready bundle
pnpm build

# Build with watch mode for continuous compilation
pnpm watch

# Perform static analysis with ESLint
pnpm lint

# Automatically fix linting violations
pnpm lint:fix

# Verify TypeScript types without emitting code
pnpm typecheck

# Check code formatting with Prettier
pnpm format:check

# Auto-format all source files with Prettier
pnpm format:write
```

The application will be accessible at:  
👉 **Local Backoffice Portal**: [http://localhost:4200](http://localhost:4200)

---

## 🧪 Comprehensive Testing Suite & Execution Guide

The testing architecture is built on top of **Jasmine 5**, **Karma 6**, and **ChromeHeadlessCI**, configured with path aliases (`@core/*`, `@shared/*`, `@features/*`, `@environments/*`) and `karma-coverage` for instant feedback, regression safety, and CI/CD validation.

### 🌐 1. Global Test Execution (Entire Test Suite)

Run all unit and integration tests across the codebase:

```bash
# Run all tests in interactive Watch Mode (opens Chrome browser and re-runs on file changes)
pnpm test

# Run all unit tests once in Headless Chrome with code coverage report
pnpm test:unit

# Run integration tests once in Headless Chrome (ideal for CI/CD pipelines)
pnpm test:integration

# Execute all tests and generate full HTML & LCOV coverage reports in ./coverage
pnpm test:coverage

# Run the strict CI test suite
pnpm test:ci
```

---

### 🎯 2. Targeted & Single File Execution

Execute specific test files or filtered directories without running the full test suite to accelerate development:

```bash
# Run a specific component unit test
pnpm test:unit -- --include="src/app/shared/components/ui/button/button.component.spec.ts"

# Run all tests for a specific shared UI atom or molecule
pnpm test:unit -- --include="src/app/shared/components/ui/modal/**/*.spec.ts"

# Run all unit tests for the Users feature module
pnpm test:unit -- --include="src/app/features/dashboard/pages/users/**/*.spec.ts"

# Run all unit tests for the Tasks feature module
pnpm test:unit -- --include="src/app/features/dashboard/pages/tasks/**/*.spec.ts"

# Run all core security tests (Guards & Interceptors)
pnpm test:unit -- --include="src/app/core/**/*.spec.ts"

# Run tests in interactive watch mode for a single component
pnpm test -- --include="src/app/shared/components/ui/input/input.component.spec.ts"
```

---

### 📊 3. Granular Code Coverage & Reporting

Code coverage reports are generated automatically using `karma-coverage` with multiple output formats:

```bash
# Generate comprehensive coverage across all source files
pnpm test:coverage
```

- **Interactive HTML Report**: Open `coverage/index.html` in any browser to inspect line-by-line coverage, branch conditions, and statement execution.
- **Terminal Text Summary**: Printed directly in the console output after test completion.
- **LCOV Report**: Exported to `coverage/lcov.info` for seamless integration with SonarQube, Codecov, or GitHub Actions.

---

### 🛡️ 4. Testing Architecture & Patterns

The backoffice adheres to modern Angular testing paradigms:

- **Signal Reactivity Testing**: State updates via signals are tested synchronously. Modifying a signal value and invoking `fixture.detectChanges()` immediately reflects in the DOM debug element.
- **Functional Interceptors & Guards**: Tested using `TestBed.runInInjectionContext()` to validate dependency resolution without requiring legacy class wrappers.
- **Isolated HTTP Mocking**: Service tests utilize `HttpTestingController` via `provideHttpClientTesting()` to verify request paths, headers (e.g. Bearer JWT), and mock response bodies safely.
- **Component Isolation**: Dumb presentational components test `@Input` (`input()`) signal changes and `@Output` (`output()`) event emissions cleanly without side effects.

---

> This digital ecosystem has been designed, structured, and developed to high-performance standards by **[Cabuweb](https://cabuweb.com)** - **Software Developer: Diego Villa**.
