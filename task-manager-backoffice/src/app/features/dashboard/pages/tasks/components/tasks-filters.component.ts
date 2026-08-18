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
  selector: 'app-tasks-filters',
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
            id="tasks-search-input"
            placeholder="Buscar tarea por título, código o tag..."
            [value]="searchQuery()"
            (searchChange)="searchChange.emit($event)"
            (cleared)="searchChange.emit('')"
          />
        </div>

        <!-- Status Filter Select -->
        <div class="w-full sm:w-48">
          <app-select
            id="tasks-status-select"
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
export class TasksFiltersComponent {
  readonly searchQuery = input<string>('');
  readonly statusFilter = input<string>('');

  readonly searchChange = output<string>();
  readonly statusChange = output<string>();
  readonly clearFilters = output<void>();

  readonly statusOptions: SelectOption[] = [
    { label: 'Todos los Estados', value: '' },
    { label: 'Por Hacer', value: 'TODO' },
    { label: 'En Progreso', value: 'IN_PROGRESS' },
    { label: 'Completada', value: 'COMPLETED' },
  ];
}
