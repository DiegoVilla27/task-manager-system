import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProgressVariant =
  'primary' | 'success' | 'warning' | 'danger' | 'auto';
export type ProgressHeight = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full" [class]="customClass()">
      @if (showLabel()) {
        <div class="flex items-center justify-between text-[11px] mb-1">
          <span class="text-slate-400">{{ label() }}</span>
          <span class="font-bold text-white font-mono"
            >{{ percentage() }}%</span
          >
        </div>
      }
      <div
        class="w-full bg-slate-800 rounded-full overflow-hidden"
        [class]="containerHeightClasses()"
      >
        <div
          class="rounded-full transition-all duration-300"
          [class]="fillClasses()"
          [style.width.%]="percentage()"
        ></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly variant = input<ProgressVariant>('auto');
  readonly height = input<ProgressHeight>('sm');
  readonly showLabel = input<boolean>(false);
  readonly label = input<string>('Avance');
  readonly customClass = input<string>('');

  protected readonly percentage = computed(() => {
    const val = this.value();
    const maxVal = this.max() || 100;
    const pct = Math.round((val / maxVal) * 100);
    return Math.min(Math.max(pct, 0), 100);
  });

  protected readonly containerHeightClasses = computed(() => {
    const heights: Record<ProgressHeight, string> = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };
    return heights[this.height()];
  });

  protected readonly fillClasses = computed(() => {
    const heights: Record<ProgressHeight, string> = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const pct = this.percentage();
    let variantColor: string;

    if (this.variant() === 'auto') {
      if (pct === 100) {
        variantColor = 'bg-emerald-500';
      } else if (pct > 0) {
        variantColor = 'bg-indigo-500';
      } else {
        variantColor = 'bg-slate-700';
      }
    } else {
      const colors: Record<Exclude<ProgressVariant, 'auto'>, string> = {
        primary: 'bg-indigo-500',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-rose-500',
      };
      variantColor = colors[this.variant() as Exclude<ProgressVariant, 'auto'>];
    }

    return `${heights[this.height()]} ${variantColor}`;
  });
}
