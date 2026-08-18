import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarComponent } from '@shared/components/ui';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AvatarComponent],
  template: `
    <aside
      class="shrink-0 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-20"
      [class.w-[300px]]="!isCollapsed()"
      [class.w-20]="isCollapsed()"
    >
      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <!-- Section: Módulos Principales -->
        <div>
          @if (!isCollapsed()) {
            <p
              class="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"
            >
              Módulos del Sistema
            </p>
          }
          <nav class="space-y-1.5" aria-label="Navegación principal">
            <!-- Tasks Link -->
            <a
              routerLink="/dashboard/tasks"
              routerLinkActive="bg-indigo-600/15 text-indigo-400 border-indigo-500 font-semibold shadow-xs"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all group"
              [title]="isCollapsed() ? 'Gestión de Tareas' : ''"
            >
              <div
                class="p-1 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              @if (!isCollapsed()) {
                <div class="flex-1 flex items-center justify-between">
                  <span class="text-sm">Gestión de Tareas</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium"
                  >
                    CRUD
                  </span>
                </div>
              }
            </a>

            <!-- Users Link -->
            <a
              routerLink="/dashboard/users"
              routerLinkActive="bg-indigo-600/15 text-indigo-400 border-indigo-500 font-semibold shadow-xs"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all group"
              [title]="isCollapsed() ? 'Gestión de Usuarios' : ''"
            >
              <div
                class="p-1 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              @if (!isCollapsed()) {
                <div class="flex-1 flex items-center justify-between">
                  <span class="text-sm">Gestión de Usuarios</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium"
                  >
                    CRUD
                  </span>
                </div>
              }
            </a>
          </nav>
        </div>

        <!-- Section: Autenticación -->
        <div>
          @if (!isCollapsed()) {
            <p
              class="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"
            >
              Acceso
            </p>
          }
          <nav class="space-y-1" aria-label="Navegación de acceso">
            <a
              routerLink="/auth/login"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 border border-transparent transition-all group"
              [title]="isCollapsed() ? 'Pantalla de Login' : ''"
            >
              <div
                class="p-1 rounded-lg text-slate-400 group-hover:text-amber-400 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              @if (!isCollapsed()) {
                <div class="flex-1 flex items-center justify-between">
                  <span class="text-sm">Login / Auth</span>
                  <span class="text-[10px] text-slate-500">Vista</span>
                </div>
              }
            </a>
          </nav>
        </div>
      </div>

      <!-- System Status card -->
      @if (!isCollapsed()) {
        <div
          class="px-4 py-3 mx-3 mb-3 rounded-xl bg-slate-950/60 border border-slate-800/60"
        >
          <div
            class="flex items-center justify-between text-xs text-slate-400 mb-1"
          >
            <span class="flex items-center gap-1.5">
              <span
                class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              ></span>
              Servidor Backend
            </span>
            <span class="text-emerald-400 font-mono text-[11px]"
              >Conectado</span
            >
          </div>
          <div class="text-[11px] text-slate-500">
            Rol activo:
            <span class="text-indigo-300 font-semibold">Super Admin</span>
          </div>
        </div>
      }

      <!-- Aside User Footer -->
      <div class="p-3 border-t border-slate-800/80">
        <div
          class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors"
        >
          <app-avatar
            name="Diego Villa"
            initials="DV"
            size="sm"
            avatarBg="from-indigo-500 to-purple-600"
          />
          @if (!isCollapsed()) {
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-white truncate">
                Diego Villa
              </p>
              <p class="text-[10px] text-slate-400 truncate">
                diego&#64;taskmanager.io
              </p>
            </div>
            <a
              routerLink="/auth/login"
              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </a>
          }
        </div>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly isCollapsed = input<boolean>(false);
}
