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
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex items-start gap-2.5 select-none" [class]="customClass()">
      <div class="flex items-center h-5">
        <input
          [id]="id() || null"
          [name]="name() || null"
          type="checkbox"
          [checked]="checked()"
          [disabled]="effectiveDisabled()"
          (change)="handleChange($event)"
          (blur)="handleBlur($event)"
          class="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      @if (label() || description()) {
        <div class="text-xs">
          @if (label()) {
            <label
              [for]="id() || null"
              class="font-medium text-slate-300 cursor-pointer block"
              [class.opacity-50]="effectiveDisabled()"
            >
              {{ label() }}
            </label>
          }
          @if (description()) {
            <p class="text-slate-400 mt-0.5">{{ description() }}</p>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly label = input<string>('');
  readonly description = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly customClass = input<string>('');

  readonly checkedChange = output<boolean>();
  readonly blurred = output<FocusEvent>();

  // Internal reactive CVA state
  protected readonly checked = signal<boolean>(false);
  protected readonly isCvaDisabled = signal<boolean>(false);

  private onChange: (value: boolean) => void = (val: boolean) => {
    void val;
  };
  private onTouched: () => void = () => {
    /* initial noop */
  };

  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.isCvaDisabled(),
  );

  // --- ControlValueAccessor Implementation ---
  writeValue(value: boolean | null): void {
    this.checked.set(Boolean(value));
  }

  registerOnChange(fn: (value: boolean) => void): void {
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
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    this.checked.set(value);
    this.onChange(value);
    this.checkedChange.emit(value);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }
}
