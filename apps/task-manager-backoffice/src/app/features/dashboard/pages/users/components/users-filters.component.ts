import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { LucideRotateCw } from '@lucide/angular';
import { ButtonComponent, SearchInputComponent } from '@shared/components/ui';

@Component({
  selector: 'app-users-filters',
  standalone: true,
  imports: [
    CommonModule,
    SearchInputComponent,
    ButtonComponent,
    LucideRotateCw,
  ],
  template: `
    <div
      class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3"
    >
      <div class="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
        <!-- Search Input -->
        <div class="w-full">
          <app-search-input
            id="users-search-input"
            placeholder="Buscar por nombre, email o ID..."
            [value]="search()"
            (searchChange)="searchChange.emit($event)"
            (cleared)="searchChange.emit('')"
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
          <svg class="w-4 h-4" lucideRotateCw></svg>
        </app-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFiltersComponent {
  readonly search = input<string>('');
  readonly searchChange = output<string>();
  readonly clearFilters = output<void>();
}
