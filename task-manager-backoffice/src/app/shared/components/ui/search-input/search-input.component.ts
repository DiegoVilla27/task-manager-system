import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full" [class]="customClass()">
      <label [for]="id()" class="sr-only">{{ ariaLabel() }}</label>
      <div
        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        [id]="id()"
        type="text"
        [placeholder]="placeholder()"
        [value]="query()"
        (input)="handleInput($event)"
        class="w-full pl-10 pr-9 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
      />

      @if (query()) {
        <button
          type="button"
          (click)="clearSearch()"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          aria-label="Limpiar búsqueda"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  readonly placeholder = input<string>('Buscar...');
  readonly value = input<string>('');
  readonly id = input<string>('search-input');
  readonly ariaLabel = input<string>('Buscar');
  readonly customClass = input<string>('');

  readonly searchChange = output<string>();
  readonly cleared = output<void>();

  protected readonly query = signal<string>('');

  constructor() {
    effect(() => {
      this.query.set(this.value());
    });
  }

  protected handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.query.set(val);
    this.searchChange.emit(val);
  }

  protected clearSearch(): void {
    this.query.set('');
    this.searchChange.emit('');
    this.cleared.emit();
  }
}
