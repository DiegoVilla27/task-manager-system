# Task Manager - Backoffice

Panel de administración y backoffice para **TaskManager System**, desarrollado con **Angular 19**, **SCSS**, **Tailwind CSS v4** y componentes con estrategia **OnPush**.

## 🚀 Estructura del Proyecto

```text
src/app/
├── core/
│   └── layout/
│       ├── backoffice-layout.component.ts   # Layout principal (Sidebar, Topbar, Breadcrumbs, User dropdown)
│       ├── backoffice-layout.component.html
│       └── backoffice-layout.component.scss
├── features/
│   ├── auth/
│   │   └── login/
│   │       ├── login.component.ts           # Maquetación de pantalla de Login (Auth)
│   │       ├── login.component.html
│   │       └── login.component.scss
│   └── dashboard/
│       ├── users/
│       │   ├── users-list.component.ts      # Maquetación CRUD Usuarios (Tabla, Filtros, Modal Crear/Editar, Modal Eliminar)
│       │   ├── users-list.component.html
│       │   └── users-list.component.scss
│       └── tasks/
│           ├── tasks-list.component.ts      # Maquetación CRUD Tareas (Tabla / Kanban, Métricas, Modal Crear/Editar, Modal Eliminar)
│           ├── tasks-list.component.html
│           └── tasks-list.component.scss
├── app.component.ts
├── app.routes.ts                            # Rutas configuradas para auth/login, dashboard/users, dashboard/tasks
└── app.config.ts
```

## 🛠️ Tecnologías y Características

- **Angular 19** (Standalone Components, Signals, Control Flow `@if` / `@for`)
- **ChangeDetectionStrategy.OnPush** en todos los componentes
- **Tailwind CSS v4** + **SCSS**
- **Vistas maquetadas (Pure UI)**:
  - `/auth/login`: Pantalla de inicio de sesión moderna para backoffice.
  - `/dashboard/users`: CRUD completo de usuarios (listado, badges de roles/estados, modales para nuevo usuario, edición y confirmación de borrado).
  - `/dashboard/tasks`: CRUD completo de tareas con selector de vista (Tabla y Tablero Kanban), badges de prioridad/estado, modales de creación, edición y eliminación.

## 💻 Comandos

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm start
# o
ng serve

# Compilar para producción
pnpm build
```
