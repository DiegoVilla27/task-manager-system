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

export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative w-full">
      <div
        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"
      >
        <ng-content select="[prefix], [slot=prefix]" />
      </div>

      <input
        [id]="id() || null"
        [name]="name() || null"
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="val()"
        [disabled]="effectiveDisabled()"
        [readOnly]="readonly()"
        [autocomplete]="autocomplete()"
        [class]="inputClasses()"
        (input)="handleInput($event)"
        (focus)="handleFocus($event)"
        (blur)="handleBlur($event)"
      />

      <div class="absolute inset-y-0 right-0 pr-3.5 flex items-center">
        <ng-content select="[suffix], [slot=suffix]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly error = input<string | boolean | null>(null);
  readonly size = input<InputSize>('md');
  readonly autocomplete = input<string>('off');
  readonly hasPrefix = input<boolean>(false);
  readonly hasSuffix = input<boolean>(false);
  readonly customClass = input<string>('');

  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  // Internal reactive CVA state
  protected readonly val = signal<string>('');
  protected readonly isCvaDisabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.isCvaDisabled(),
  );

  protected readonly inputClasses = computed(() => {
    const base =
      'w-full bg-slate-950/70 border rounded-xl text-slate-100 placeholder-slate-500 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const sizes: Record<InputSize, string> = {
      sm: 'py-1.5 text-xs',
      md: 'py-2.5 text-xs sm:text-sm',
      lg: 'py-3 text-sm sm:text-base',
    };

    const pl = this.hasPrefix() ? 'pl-10' : 'pl-3.5';
    const pr = this.hasSuffix() ? 'pr-11' : 'pr-3.5';

    const stateBorder = this.error()
      ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
      : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

    return `${base} ${sizes[this.size()]} ${pl} ${pr} ${stateBorder} ${this.customClass()}`.trim();
  });

  // --- ControlValueAccessor Implementation ---
  writeValue(value: string | null): void {
    this.val.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isCvaDisabled.set(isDisabled);
  }

  // --- DOM Event Handlers ---
  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.val.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}
