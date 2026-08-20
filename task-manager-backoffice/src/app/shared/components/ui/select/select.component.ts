import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative w-full">
      <select
        [id]="id() || null"
        [name]="name() || null"
        [disabled]="effectiveDisabled()"
        [class]="selectClasses()"
        (change)="handleChange($event)"
        (blur)="handleBlur($event)"
      >
        @if (placeholder()) {
          <option value="" [selected]="val() === '' || val() === null" disabled>
            {{ placeholder() }}
          </option>
        }
        @for (opt of options(); track opt.value) {
          <option
            [value]="opt.value"
            [disabled]="opt.disabled ?? false"
            [selected]="opt.value === val()"
            class="bg-slate-900 text-slate-100 py-1"
          >
            {{ opt.label }}
          </option>
        }
      </select>

      <div
        class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500"
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly error = input<string | boolean | null>(null);
  readonly size = input<SelectSize>('md');
  readonly customClass = input<string>('');

  readonly valueChange = output<string>();
  readonly blurred = output<FocusEvent>();

  // Internal reactive CVA state
  protected readonly val = signal<string | number | null>('');
  protected readonly isCvaDisabled = signal<boolean>(false);

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.isCvaDisabled(),
  );

  protected readonly selectClasses = computed(() => {
    const base =
      'w-full appearance-none bg-slate-950/70 border rounded-xl text-slate-200 pr-10 pl-3.5 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const sizes: Record<SelectSize, string> = {
      sm: 'h-9 text-xs',
      md: 'h-10 text-xs sm:text-sm',
      lg: 'h-12 text-sm sm:text-base',
    };

    const stateBorder = this.error()
      ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
      : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

    return `${base} ${sizes[this.size()]} ${stateBorder} ${this.customClass()}`.trim();
  });

  // --- ControlValueAccessor Implementation ---
  writeValue(value: unknown): void {
    this.val.set((value as string | number | null) ?? '');
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isCvaDisabled.set(isDisabled);
  }

  // --- DOM Event Handlers ---
  protected handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.val.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}
