# ⚛️ Task Manager Client - React 19 Frontend

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.18.2-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.10-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Oxlint](https://img.shields.io/badge/Oxlint-1.75.0-F97316?style=for-the-badge&logo=oxc&logoColor=white)](https://oxc.rs/)
[![Testing Library](https://img.shields.io/badge/Testing_Library-16.3.2-E33332?style=for-the-badge&logo=testing-library&logoColor=white)](https://testing-library.com/)

A modern, responsive, high-performance Single Page Application (SPA) for task lifecycle management. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite 8**, featuring an interactive **Kanban Board** with drag-and-drop, rich filtering, atomic UI design system, robust JWT token interceptor renewal, strict schema validation, and an enterprise-grade **Vitest** test suite.

---

## 📖 Core Features & Capabilities

- **Interactive Kanban Board**: Visual workflow organization with drag-and-drop status transitions (`PENDING`, `IN_PROGRESS`, `COMPLETED`) powered by `@hello-pangea/dnd`.
- **Alternative Table & List Views**: Fast tabular task management with inline status toggles, deletion confirmation dialogs, and editing capabilities.
- **Dynamic Search & Filters**: Debounced keyword filtering and status facet filters for instant client-side responsive querying.
- **Authentication & Security**:
  - Full authentication lifecycle (Login, Registration, Logout).
  - Private & Public route guards (`AuthenticatedGuard`, `PublicGuard`).
  - Axios HTTP Interceptors with transparent, silent 401 token refresh queueing.
- **Atomic UI Design System**: Handcrafted accessible UI component library (Buttons, Modals, Badges, Inputs, Skeletons, Dropdowns, Tables) utilizing `clsx` and `tailwind-merge`.
- **Form Management**: Strongly typed forms managed via `react-hook-form` and validated using `zod` schemas.
- **Toast Notifications**: Smooth visual notifications and error alerts powered by `sonner`.
- **Comprehensive Test Coverage**: Unit and integration test suites covering atomic components, custom hooks, and utilities with Vitest and React Testing Library.

---

## 🚀 Runtime Flow & State Architecture

```mermaid
graph TD
    User([👤 User Action]) --> UI[Atomic UI Components]
    UI --> Page[Tasks / Auth Pages]
    Page --> Store[Custom State Store / Hooks]
    Store --> Services[Feature API Services]
    Services --> AxiosClient[Axios HTTP Client]

    subgraph "Interceptors & Security"
        AxiosClient --> ReqInt[Request Interceptor: Inject Bearer JWT]
        ReqInt --> Backend[(Spring Boot API)]
        Backend --> ResInt[Response Interceptor]
        ResInt -- 401 Unauthorized --> Refresh[Silent Refresh Flow: /auth/refresh]
        Refresh --> Store
        ResInt -- 200 OK / Errors --> ErrorHandler[Sonner Toasts / UI Feedback]
    end
```

---

## 📁 Directory Structure

```text
task-manager-client/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.node.json
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── setupTests.ts                  # Vitest & Jest DOM setup configuration
│   ├── core/
│   │   ├── axios/                     # Axios instance base configuration
│   │   ├── environments/              # App environment variables & base URLs
│   │   ├── guards/                    # Route protection guards (Public / Private)
│   │   ├── http/                      # Base HTTP client wrappers
│   │   ├── interceptors/              # Request JWT injection & 401 refresh interceptor
│   │   └── router/                    # React Router definitions and route trees
│   ├── features/
│   │   ├── auth/                      # Login, Register, Session Store & Auth Services
│   │   │   ├── interfaces/
│   │   │   ├── layout/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── store/
│   │   ├── tasks/                     # Task management domain & Kanban UI
│   │   │   ├── api/
│   │   │   ├── components/            # Kanban board, Task cards, Modals, Filters
│   │   │   │   └── filters/hooks/     # Search debounce & query state hooks
│   │   │   ├── layouts/
│   │   │   ├── models/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── store/
│   │   └── users/                     # User profile lookup & services
│   └── shared/
│       ├── components/
│       │   └── ui/                    # Modular Atomic UI Components
│       │       ├── avatar/            # Avatar component & unit tests
│       │       ├── badge/             # Badge component & unit tests
│       │       ├── button/            # Button component & unit tests
│       │       ├── input/             # Input component & unit tests
│       │       ├── link/              # Link component & unit tests
│       │       ├── modal/             # Modal dialog, backdrop hooks & tests
│       │       ├── select/            # Select dropdown & unit tests
│       │       └── table/             # Modular Table (Body, Cell, Header, Row, Pagination) & tests
│       ├── hooks/                     # Custom shared hooks (use-debounce, use-me)
│       └── utils/                     # Utilities (cn class merger, clean-params, storage)
```

---

## 🛠️ Technical Stack & Dependencies

| Category         | Library / Dependency          | Version             | Purpose                                          |
| :--------------- | :---------------------------- | :------------------ | :----------------------------------------------- |
| **Framework**    | `react` & `react-dom`         | `^19.2.8`           | Core UI rendering engine                         |
| **Language**     | `typescript`                  | `~6.0.2`            | Static type system                               |
| **Build Tool**   | `vite`                        | `^8.2.0`            | Next-generation frontend tooling                 |
| **Styling**      | `tailwindcss`                 | `^4.3.3`            | Utility-first CSS engine                         |
| **Routing**      | `react-router-dom`            | `^7.18.2`           | Declarative client routing                       |
| **Drag & Drop**  | `@hello-pangea/dnd`           | `^18.0.1`           | Smooth accessible Kanban drag-and-drop           |
| **HTTP Client**  | `axios`                       | `^1.19.0`           | Promise-based HTTP client with interceptors      |
| **Validation**   | `zod`                         | `^4.4.3`            | TypeScript-first schema declaration & validation |
| **Forms**        | `react-hook-form`             | `^7.85.0`           | High-performance form state management           |
| **Icons**        | `lucide-react`                | `^1.31.0`           | Modern customizable SVG icons                    |
| **Toasts**       | `sonner`                      | `^2.0.8`            | Opinionated, accessible toast notifications      |
| **Utilities**    | `clsx` & `tailwind-merge`     | `^2.1.1` / `^3.6.0` | Dynamic CSS class merging                        |
| **Linter**       | `oxlint`                      | `^1.75.0`           | High-performance static code analysis            |
| **Formatter**    | `prettier`                    | `^3.9.6`            | Opinionated automated code formatting            |
| **Test Runner**  | `vitest`                      | `^4.1.10`           | Blazing fast Vite-native test runner             |
| **Testing DOM**  | `@testing-library/react`      | `^16.3.2`           | React component testing utilities                |
| **DOM Matchers** | `@testing-library/jest-dom`   | `^7.0.1`            | Custom Jest/Vitest DOM assertions                |
| **User Events**  | `@testing-library/user-event` | `^14.6.4`           | High-fidelity user event simulation              |
| **Coverage**     | `@vitest/coverage-v8`         | `^4.1.10`           | Native V8 code coverage provider                 |
| **Test UI**      | `@vitest/ui`                  | `^4.1.10`           | Interactive graphical test dashboard             |
| **DOM Runtime**  | `jsdom`                       | `^30.0.1`           | Headless browser environment for Node.js         |

---

## ⚙️ Provisioning & Setup Guide

### 1. Prerequisites

- **Node.js**: v18.x or higher
- **pnpm** (recommended) or **npm** installed

### 2. Environment Configuration

Create a `.env` file in `task-manager-client/`:

```env
VITE_API_URL=http://localhost:8080
```

### 3. Installation & Development

```bash
# Install project dependencies
pnpm install

# Start Vite development server
pnpm run dev

# Lint codebase with oxlint
pnpm run lint

# Build production bundle with strict typechecking
pnpm run build

# Preview production build locally
pnpm run preview
```

The application will be accessible at:  
👉 **Local Web Client**: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Comprehensive Testing Suite & Execution Guide

The testing architecture is built on top of **Vitest 4**, **React Testing Library**, and **jsdom**, configured with path aliases (`@shared/*`, `@features/*`, `@core/*`) and `@vitest/coverage-v8` for instant feedback and detailed reporting.

### 🌐 1. Global Test Execution (Entire Test Suite)

Run all unit and integration tests across the entire codebase:

```bash
# Run all tests in interactive Watch Mode (re-runs on file changes)
pnpm test

# Run all tests once and exit (ideal for CI/CD pipelines)
pnpm test:run

# Execute all tests and generate a complete V8 code coverage report
pnpm test:coverage

# Start Vitest with the interactive Web UI dashboard
pnpm test:ui
```

---

### 🎯 2. Targeted & Single File Execution

Execute specific test files without running the full test suite to accelerate development:

```bash
# Run a specific test file in Watch Mode by filename or pattern
pnpm test button

# Run a specific test file by relative path in Watch Mode
pnpm test src/shared/components/ui/button/index.test.tsx

# Run a specific test file once (Single Run / CI style)
pnpm test:run src/shared/components/ui/modal/index.test.tsx

# Run tests matching a specific directory (e.g., all table components)
pnpm test src/shared/components/ui/table
```

---

### 📊 3. Granular Code Coverage per File

Generate focused coverage reports for specific modules or individual components:

```bash
# Run coverage specifically for a single test suite
pnpm test:coverage -- src/shared/components/ui/select/index.test.tsx

# Run coverage in Watch Mode for continuous coverage feedback during development
pnpm test:coverage:watch -- src/shared/utils/storage/index.test.ts

# Generate coverage metrics strictly for the target source file (isolates the coverage table)
pnpm test:coverage -- src/shared/components/ui/badge/index.test.tsx --coverage.include="src/shared/components/ui/badge/index.tsx"

# Generate coverage for a feature hook
pnpm test:coverage -- src/shared/hooks/use-debounce/index.test.ts --coverage.include="src/shared/hooks/use-debounce/**"
```

---

### 🖥️ 4. Interactive Vitest UI Dashboard

Vitest provides a browser-based user interface to visually inspect test hierarchy, execution times, component render outputs, and console logs:

```bash
# Open the full Vitest UI dashboard in your browser
pnpm test:ui

# Open the UI dashboard focused on a single component test
pnpm test:ui src/shared/components/ui/table/components/pagination/index.test.tsx
```

---

### 🔍 5. Filter Tests by Name or Pattern

Filter and execute only the tests whose descriptions match a specific text or regular expression:

```bash
# Run only tests matching a name pattern (e.g., tests verifying rendering behavior)
pnpm test -t "should render"

# Run only tests related to click or change interactions
pnpm test -t "should handle click"
```

---

> This digital ecosystem has been designed, structured, and developed to high-performance standards by **[Cabuweb](https://cabuweb.com)** - **Software Developer: Diego Villa**.
