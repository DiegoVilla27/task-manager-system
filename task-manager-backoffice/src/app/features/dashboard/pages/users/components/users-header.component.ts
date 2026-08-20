import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/ui';

@Component({
  selector: 'app-users-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div>
        <div
          class="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1"
        >
          <span>Backoffice</span>
          <span>/</span>
          <span class="text-slate-400">Administración</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Gestión de Usuarios
        </h1>
        <p class="text-sm text-slate-400 mt-1">
          Control de accesos, roles de backoffice y estado de cuentas
        </p>
      </div>

      <div class="flex items-center gap-3">
        <app-button
          variant="primary"
          size="md"
          (clicked)="newUserClicked.emit()"
        >
          <svg
            class="w-4 h-4 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Nuevo Usuario</span>
        </app-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersHeaderComponent {
  readonly newUserClicked = output<void>();
}
