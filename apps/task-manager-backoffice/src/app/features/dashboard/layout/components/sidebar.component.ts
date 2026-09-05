import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideClipboardList, LucideUsers } from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideUsers,
    LucideClipboardList,
  ],
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
                <svg class="w-5 h-5" lucideUsers></svg>
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
                <svg class="w-5 h-5" lucideClipboardList></svg>
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
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly isCollapsed = input<boolean>(false);
}
