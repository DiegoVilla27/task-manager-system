import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'purple';

export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      @if (dot()) {
        <span
          class="w-1.5 h-1.5 rounded-full"
          [class]="dotClasses()"
          [class.animate-pulse]="pulse()"
          aria-hidden="true"
        ></span>
      }
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('default');
  readonly size = input<BadgeSize>('sm');
  readonly dot = input<boolean>(false);
  readonly pulse = input<boolean>(false);
  readonly customClass = input<string>('');

  protected readonly badgeClasses = computed(() => {
    const base =
      'inline-flex items-center gap-1.5 font-medium rounded-full border select-none';

    const sizes: Record<BadgeSize, string> = {
      sm: 'text-[11px] px-2.5 py-0.5',
      md: 'text-xs px-3 py-1',
    };

    const variants: Record<BadgeVariant, string> = {
      default: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
      primary: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      neutral: 'bg-slate-500/15 text-slate-300 border-slate-600/40',
    };

    return `${base} ${sizes[this.size()]} ${variants[this.variant()]} ${this.customClass()}`.trim();
  });

  protected readonly dotClasses = computed(() => {
    const dotColors: Record<BadgeVariant, string> = {
      default: 'bg-slate-400',
      primary: 'bg-indigo-400',
      success: 'bg-emerald-400',
      warning: 'bg-amber-400',
      danger: 'bg-rose-400',
      info: 'bg-cyan-400',
      purple: 'bg-purple-400',
      neutral: 'bg-slate-400',
    };

    return dotColors[this.variant()] || 'bg-slate-400';
  });
}
