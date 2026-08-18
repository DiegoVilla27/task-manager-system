import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  SearchInputComponent,
  SelectComponent,
  SelectOption,
} from '@shared/components/ui';

@Component({
  selector: 'app-users-filters',
  standalone: true,
  imports: [
    CommonModule,
    SearchInputComponent,
    SelectComponent,
    ButtonComponent,
  ],
  template: `
    <div
      class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3"
    >
      <div class="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
        <!-- Search Input -->
        <div class="w-full sm:w-80">
          <app-search-input
            id="users-search-input"
            placeholder="Buscar por nombre, email o ID..."
            [value]="searchQuery()"
            (searchChange)="searchChange.emit($event)"
            (cleared)="searchChange.emit('')"
          />
        </div>

        <!-- Role Select -->
        <div class="w-full sm:w-44">
          <app-select
            id="users-role-select"
            [options]="roleOptions"
            placeholder="Todos los Roles"
            (valueChange)="roleChange.emit($event)"
          />
        </div>

        <!-- Status Select -->
        <div class="w-full sm:w-44">
          <app-select
            id="users-status-select"
            [options]="statusOptions"
            placeholder="Todos los Estados"
            (valueChange)="statusChange.emit($event)"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 self-end sm:self-center">
        <app-button
          variant="outline"
          size="sm"
          (clicked)="clearFilters.emit()"
          customClass="text-slate-400 hover:text-white"
        >
          Limpiar Filtros
        </app-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFiltersComponent {
  readonly searchQuery = input<string>('');
  readonly roleFilter = input<string>('');
  readonly statusFilter = input<string>('');

  readonly searchChange = output<string>();
  readonly roleChange = output<string>();
  readonly statusChange = output<string>();
  readonly clearFilters = output<void>();

  readonly roleOptions: SelectOption[] = [
    { label: 'Todos los Roles', value: '' },
    { label: 'Super Admin', value: 'SUPER_ADMIN' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Developer', value: 'DEVELOPER' },
    { label: 'Viewer', value: 'VIEWER' },
  ];

  readonly statusOptions: SelectOption[] = [
    { label: 'Todos los Estados', value: '' },
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Inactivo', value: 'INACTIVE' },
  ];
}
