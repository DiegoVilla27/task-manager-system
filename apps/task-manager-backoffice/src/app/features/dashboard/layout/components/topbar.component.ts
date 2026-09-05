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
  LucideChevronDown,
  LucideChevronsLeft,
  LucideClipboardPen,
} from '@lucide/angular';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
} from '@shared/components/ui';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    LucideClipboardPen,
    LucideChevronsLeft,
    LucideChevronDown,
  ],
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
            <svg class="w-5 h-5 text-white" lucideClipboardPen></svg>
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
            lucideChevronsLeft
          ></svg>
        </button>
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
            <svg class="w-4 h-4 text-slate-400" lucideChevronDown></svg>
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
