import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type SearchInputSize = 'sm' | 'md' | 'lg';

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
        [class]="inputClasses()"
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
  readonly size = input<SearchInputSize>('md');
  readonly customClass = input<string>('');

  readonly searchChange = output<string>();
  readonly cleared = output<void>();

  protected readonly query = signal<string>('');

  protected readonly inputClasses = computed(() => {
    const base =
      'w-full pl-10 pr-9 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all';

    const sizes: Record<SearchInputSize, string> = {
      sm: 'h-9 text-xs',
      md: 'h-10 text-xs sm:text-sm',
      lg: 'h-12 text-sm sm:text-base',
    };

    return `${base} ${sizes[this.size()]}`.trim();
  });

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
