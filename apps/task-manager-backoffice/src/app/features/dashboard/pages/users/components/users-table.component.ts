import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { AvatarComponent, PaginationComponent } from '@shared/components/ui';
import { PageUserResponse, UserResponse } from '@task-manager-system/api-types';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, AvatarComponent, PaginationComponent, DatePipe],
  template: `
    <div
      class="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
    >
      <div class="overflow-x-auto">
        <table
          class="w-full text-left text-xs text-slate-300"
          aria-label="Listado de usuarios de backoffice"
        >
          <thead
            class="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            <tr>
              <th scope="col" class="px-6 py-4">Usuario & Email</th>
              <th scope="col" class="px-6 py-4">Tareas Asignadas</th>
              <th scope="col" class="px-6 py-4">Creado</th>
              <th scope="col" class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80">
            @for (user of users()?.content; track user.id) {
              <tr class="hover:bg-slate-800/40 transition-colors">
                <!-- User Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <app-avatar
                      [name]="user.name!"
                      [initials]="user.name![0] + '' + user.lastname![0]"
                      size="md"
                    />
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-semibold text-white text-sm">
                          {{ user.name }} {{ user.lastname }}
                        </span>
                      </div>
                      <span class="text-slate-400 text-xs mt-0.5 block">
                        {{ user.email }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Assigned Tasks -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-white font-mono text-sm">
                      {{ user.countTasks }}
                    </span>
                    <span class="text-[11px] text-slate-500">activas</span>
                  </div>
                </td>

                <!-- Last Login -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-slate-300 text-xs">
                    <p>{{ user.createdAt | date }}</p>
                  </div>
                </td>

                <!-- Actions CRUD -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      (click)="edit.emit(user)"
                      class="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                      [title]="'Editar usuario ' + user.name"
                      [attr.aria-label]="'Editar usuario ' + user.name"
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
                      (click)="delete.emit(user)"
                      class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      [title]="'Eliminar usuario ' + user.name"
                      [attr.aria-label]="'Eliminar usuario ' + user.name"
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
                  No se encontraron usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <app-pagination
        [currentPage]="page()"
        [totalItems]="users()?.totalElements ?? 0"
        itemLabel="usuarios"
        (pageChange)="pageChange.emit($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableComponent {
  readonly users = input.required<PageUserResponse | undefined>();
  readonly page = input.required<number>();

  readonly edit = output<UserResponse>();
  readonly delete = output<UserResponse>();
  readonly pageChange = output<number>();
}
