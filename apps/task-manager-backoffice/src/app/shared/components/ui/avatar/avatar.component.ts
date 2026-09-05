import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-flex shrink-0">
      @if (src()) {
        <img
          [src]="src()"
          [alt]="name() || 'Avatar'"
          [class]="avatarClasses()"
          class="object-cover rounded-full"
        />
      } @else {
        <div
          [class]="avatarClasses()"
          [title]="name() || ''"
          [attr.aria-label]="name() || 'Avatar'"
        >
          {{ displayInitials() }}
        </div>
      }

      @if (status()) {
        <span
          class="absolute bottom-0 right-0 rounded-full ring-2 ring-slate-900"
          [class]="statusClasses()"
          aria-hidden="true"
        ></span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly name = input<string>('');
  readonly initials = input<string>('');
  readonly avatarBg = input<string>('from-indigo-600 to-purple-600');
  readonly src = input<string | null>(null);
  readonly size = input<AvatarSize>('md');
  readonly status = input<AvatarStatus | null>(null);
  readonly customClass = input<string>('');

  protected readonly displayInitials = computed(() => {
    if (this.initials()) return this.initials().toUpperCase();
    if (!this.name()) return '?';
    const parts = this.name().trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  });

  protected readonly avatarClasses = computed(() => {
    const base =
      'rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-slate-700 select-none bg-gradient-to-tr';

    const sizes: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-7 h-7 text-xs',
      md: 'w-8 h-8 text-xs',
      lg: 'w-10 h-10 text-sm',
      xl: 'w-12 h-12 text-base',
    };

    return `${base} ${sizes[this.size()]} ${this.avatarBg()} ${this.customClass()}`.trim();
  });

  protected readonly statusClasses = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
    };

    const statusColors: Record<AvatarStatus, string> = {
      online: 'bg-emerald-400',
      offline: 'bg-slate-500',
      busy: 'bg-rose-500',
      away: 'bg-amber-400',
    };

    const currentStatus = this.status();
    const color = currentStatus ? statusColors[currentStatus] : '';
    return `${sizes[this.size()]} ${color}`.trim();
  });
}
