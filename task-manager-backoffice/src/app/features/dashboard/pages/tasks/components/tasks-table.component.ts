import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  AvatarComponent,
  BadgeComponent,
  PaginationComponent,
} from '@shared/components/ui';
import { TaskResponse, TasksPagination } from '../interfaces/response';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    BadgeComponent,
    PaginationComponent,
    DatePipe,
  ],
  template: `
    <div
      class="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
    >
      <div class="overflow-x-auto">
        <table
          class="w-full text-left text-xs text-slate-300"
          aria-label="Listado de tareas del sistema"
        >
          <thead
            class="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            <tr>
              <th scope="col" class="px-6 py-4">Código</th>
              <th scope="col" class="px-6 py-4">Tarea</th>
              <th scope="col" class="px-6 py-4">Asignado a</th>
              <th scope="col" class="px-6 py-4">Estado</th>
              <th scope="col" class="px-6 py-4">Fecha Creación</th>
              <th scope="col" class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80">
            @for (task of tasks()?.content; track task.id) {
              <tr class="hover:bg-slate-800/40 transition-colors">
                <!-- Task ID -->
                <td class="px-6 py-4">
                  <span
                    class="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-400 font-mono text-[11px] font-bold border border-slate-700"
                  >
                    {{ task.id.slice(0, 5) + '...' }}
                  </span>
                </td>

                <!-- Task Details -->
                <td class="px-6 py-4">
                  <div class="max-w-md">
                    <p class="font-semibold text-white text-sm leading-snug">
                      {{ task.title }}
                    </p>
                    <p class="text-slate-400 text-xs mt-1 line-clamp-1">
                      {{ task.description }}
                    </p>
                  </div>
                </td>

                <!-- Assignee -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2.5">
                    <app-avatar
                      [name]="task.user.name"
                      [initials]="
                        task.user.name[0] + ' ' + task.user.lastname[0]
                      "
                      size="md"
                    />
                    <div>
                      <p class="font-medium text-slate-200">
                        {{ task.user.name }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  @if (task.status === 'PENDING') {
                    <app-badge variant="neutral" [dot]="true">
                      Por Hacer
                    </app-badge>
                  } @else if (task.status === 'IN_PROGRESS') {
                    <app-badge variant="primary" [dot]="true" [pulse]="true">
                      En Progreso
                    </app-badge>
                  } @else {
                    <app-badge variant="success" [dot]="true">
                      Completada
                    </app-badge>
                  }
                </td>

                <!-- Due Date -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-1.5 text-slate-300">
                    <svg
                      class="w-4 h-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{{ task.createdAt | date }}</span>
                  </div>
                </td>

                <!-- Actions CRUD -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      (click)="edit.emit(task)"
                      class="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                      [title]="'Editar tarea ' + task.title"
                      [attr.aria-label]="'Editar tarea ' + task.title"
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
                          d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      (click)="delete.emit(task)"
                      class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      [title]="'Eliminar tarea ' + task.title"
                      [attr.aria-label]="'Eliminar tarea ' + task.title"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                  No se encontraron tareas registradas con los filtros actuales.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <app-pagination
        [currentPage]="page()"
        [totalItems]="tasks()?.totalElements ?? 0"
        itemLabel="tareas"
        (pageChange)="pageChange.emit($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTableComponent {
  readonly tasks = input.required<TasksPagination | undefined>();
  readonly page = input.required<number>();

  readonly edit = output<TaskResponse>();
  readonly delete = output<TaskResponse>();
  readonly pageChange = output<number>();
}
