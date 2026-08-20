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

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <textarea
      [id]="id() || null"
      [name]="name() || null"
      [rows]="rows()"
      [placeholder]="placeholder()"
      [value]="val()"
      [disabled]="effectiveDisabled()"
      [readOnly]="readonly()"
      [class]="textareaClasses()"
      (input)="handleInput($event)"
      (blur)="handleBlur($event)"
    ></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(3);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly error = input<string | boolean | null>(null);
  readonly customClass = input<string>('');

  readonly valueChange = output<string>();
  readonly blurred = output<FocusEvent>();

  // Internal reactive CVA state
  protected readonly val = signal<string>('');
  protected readonly isCvaDisabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.isCvaDisabled(),
  );

  protected readonly textareaClasses = computed(() => {
    const base =
      'w-full bg-slate-950/70 border rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-3.5 py-2.5 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const stateBorder = this.error()
      ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
      : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

    return `${base} ${stateBorder} ${this.customClass()}`.trim();
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
    const target = event.target as HTMLTextAreaElement;
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
