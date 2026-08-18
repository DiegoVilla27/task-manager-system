import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { AuthService } from '@features/auth/services/auth.service';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
} from '@shared/components/ui';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, AvatarComponent, BadgeComponent, ButtonComponent],
  template: `
    <header
      class="h-16 w-full shrink-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-30"
    >
      <!-- Brand / Toggle & Left Title -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0"
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
              <app-button
                title="Cerrar sesión"
                ariaLabel="Cerrar sesión"
                variant="danger"
                [fullWidth]="true"
                (clicked)="authService.logout()"
              >
                Cerrar sesión
              </app-button>
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
  readonly isUserMenuOpen = input<boolean>(false);

  readonly toggleSidebar = output<void>();
  readonly toggleUserMenu = output<void>();

  public readonly authService = inject(AuthService);
}
