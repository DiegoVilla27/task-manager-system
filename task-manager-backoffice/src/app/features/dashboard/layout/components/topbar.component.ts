import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent, BadgeComponent } from '@shared/components/ui';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, BadgeComponent],
  template: `
    <header
      class="h-16 w-full shrink-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-30"
    >
      <!-- Brand / Toggle & Left Title -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <div class="flex flex-col">
            <span
              class="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 leading-none"
            >
              TaskManager
              <app-badge variant="primary" size="sm">Backoffice</app-badge>
            </span>
            <span class="text-[11px] text-slate-400 font-medium mt-0.5">
              Admin Console
            </span>
          </div>
        </div>

        <button
          type="button"
          (click)="toggleSidebar.emit()"
          class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
          title="Alternar barra lateral"
          aria-label="Alternar barra lateral"
        >
          <svg
            class="w-5 h-5 transition-transform duration-200"
            [class.rotate-180]="isSidebarCollapsed()"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Global Search -->
        <div
          class="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 w-64 lg:w-72"
        >
          <svg
            class="w-3.5 h-3.5 text-slate-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span class="flex-1 text-slate-500 select-none"
            >Buscar en backoffice...</span
          >
          <kbd
            class="px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700"
            >⌘K</kbd
          >
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <!-- Admin Tag -->
        <div
          class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs"
        >
          <span
            class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
          ></span>
          <span class="text-slate-300 font-medium">Panel Admin</span>
          <span
            class="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono"
            >OnPush</span
          >
        </div>

        <!-- Notifications Dropdown Trigger -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleNotifications.emit()"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
            title="Notificaciones"
            aria-label="Ver notificaciones del sistema"
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              class="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900"
            ></span>
          </button>

          @if (isNotificationsOpen()) {
            <div
              class="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div
                class="flex items-center justify-between pb-3 border-b border-slate-800"
              >
                <span class="text-xs font-semibold text-white">
                  Notificaciones del Sistema
                </span>
                <button
                  type="button"
                  class="text-[11px] text-indigo-400 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Marcar leídas
                </button>
              </div>
              <div class="py-3 space-y-2.5 text-xs">
                <div
                  class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <p class="font-medium text-slate-200">Usuario registrado</p>
                  <p class="text-slate-400 text-[11px] mt-0.5">
                    Hace 5 minutos · admin&#64;taskmanager.io
                  </p>
                </div>
                <div
                  class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <p class="font-medium text-slate-200">Tarea creada</p>
                  <p class="text-slate-400 text-[11px] mt-0.5">
                    Hace 25 minutos · TM-101
                  </p>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- User Menu Dropdown Trigger -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleUserMenu.emit()"
            class="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Abrir menú de usuario"
          >
            <app-avatar
              name="Diego Villa"
              initials="DV"
              size="sm"
              avatarBg="from-indigo-600 to-cyan-500"
            />
            <div class="hidden sm:block text-left">
              <p class="text-xs font-semibold text-slate-200 leading-tight">
                Diego Villa
              </p>
              <p class="text-[10px] text-slate-400 leading-tight">
                Super Admin
              </p>
            </div>
            <svg
              class="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          @if (isUserMenuOpen()) {
            <div
              class="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div class="px-3 py-2 border-b border-slate-800 mb-1">
                <p class="text-xs font-bold text-white">Diego Villa</p>
                <p class="text-[11px] text-slate-400">
                  admin&#64;taskmanager.io
                </p>
              </div>
              <a
                routerLink="/dashboard/users"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg
                  class="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Usuarios
              </a>
              <a
                routerLink="/dashboard/tasks"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg
                  class="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Tareas
              </a>
              <div class="my-1 border-t border-slate-800"></div>
              <a
                routerLink="/auth/login"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
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
                Cerrar Sesión
              </a>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  readonly isSidebarCollapsed = input<boolean>(false);
  readonly isNotificationsOpen = input<boolean>(false);
  readonly isUserMenuOpen = input<boolean>(false);

  readonly toggleSidebar = output<void>();
  readonly toggleNotifications = output<void>();
  readonly toggleUserMenu = output<void>();
}
