import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '@shared/components/ui';
import { UserMock } from '../models/user.model';

@Component({
  selector: 'app-users-stats',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <app-stat-card
        title="Total Usuarios"
        [value]="totalCount()"
        trend="up"
        trendText="+3 este mes"
        iconBg="bg-indigo-500/10 text-indigo-400"
      >
        <svg
          icon
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </app-stat-card>

      <app-stat-card
        title="Activos Ahora"
        [value]="activeCount()"
        subtitle="87.5% de tasa de actividad"
        iconBg="bg-emerald-500/10 text-emerald-400"
      >
        <svg
          icon
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </app-stat-card>

      <app-stat-card
        title="Pendientes"
        [value]="pendingCount()"
        subtitle="Invitaciones por confirmar"
        iconBg="bg-amber-500/10 text-amber-400"
      >
        <svg
          icon
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </app-stat-card>

      <app-stat-card
        title="Administradores"
        [value]="adminCount()"
        subtitle="Acceso con privilegios totales"
        iconBg="bg-purple-500/10 text-purple-400"
      >
        <svg
          icon
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </app-stat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersStatsComponent {
  readonly users = input.required<UserMock[]>();
  readonly totalRegistered = input<number>(24);

  protected readonly totalCount = computed(() => this.totalRegistered());

  protected readonly activeCount = computed(() => {
    return this.users().filter((u) => u.status === 'ACTIVE').length || 21;
  });

  protected readonly pendingCount = computed(() => {
    return this.users().filter((u) => u.status === 'PENDING').length || 2;
  });

  protected readonly adminCount = computed(() => {
    return (
      this.users().filter((u) => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN')
        .length || 4
    );
  });
}
