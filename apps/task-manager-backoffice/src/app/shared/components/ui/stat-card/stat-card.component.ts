import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all hover:border-slate-700/80"
      [class]="customClass()"
    >
      <div class="flex items-center justify-between">
        <span
          class="text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {{ title() }}
        </span>

        @if (dotColor()) {
          <span
            class="w-2 h-2 rounded-full"
            [class]="dotColor()"
            [class.animate-pulse]="dotPulse()"
            aria-hidden="true"
          ></span>
        }

        @if (iconBg()) {
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center"
            [class]="iconBg()"
          >
            <ng-content select="[icon]" />
          </div>
        }
      </div>

      <div class="mt-2">
        <p class="text-2xl font-bold tracking-tight" [class]="valueColor()">
          {{ value() }}
        </p>

        @if (trendText()) {
          <div
            class="flex items-center gap-1.5 text-xs mt-1 font-medium"
            [class.text-emerald-400]="trend() === 'up'"
            [class.text-rose-400]="trend() === 'down'"
            [class.text-slate-400]="trend() === null"
          >
            @if (trend() === 'up') {
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            } @else if (trend() === 'down') {
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            }
            <span>{{ trendText() }}</span>
          </div>
        } @else if (subtitle()) {
          <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">
            {{ subtitle() }}
          </p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly subtitle = input<string>('');
  readonly dotColor = input<string>('');
  readonly dotPulse = input<boolean>(false);
  readonly iconBg = input<string>('');
  readonly trend = input<'up' | 'down' | null>(null);
  readonly trendText = input<string>('');
  readonly valueColor = input<string>('text-white');
  readonly customClass = input<string>('');
}
