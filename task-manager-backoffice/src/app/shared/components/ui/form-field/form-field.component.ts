import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-1.5" [class]="customClass()">
      @if (label()) {
        <div class="flex items-center justify-between">
          <label
            [for]="forId() || null"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {{ label() }}
            @if (required()) {
              <span class="text-rose-400 font-bold ml-0.5">*</span>
            }
          </label>
          <ng-content select="[label-action]" />
        </div>
      }

      <ng-content />

      @if (error() && isStringError()) {
        <p class="text-xs text-rose-400 mt-1 flex items-center gap-1">
          <svg
            class="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{{ error() }}</span>
        </p>
      } @else if (hint()) {
        <p class="text-xs text-slate-400 mt-1">{{ hint() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  readonly label = input<string>('');
  readonly forId = input<string>('');
  readonly required = input<boolean>(false);
  readonly hint = input<string>('');
  readonly error = input<string | boolean | null>(null);
  readonly customClass = input<string>('');

  protected isStringError(): boolean {
    return typeof this.error() === 'string';
  }
}
