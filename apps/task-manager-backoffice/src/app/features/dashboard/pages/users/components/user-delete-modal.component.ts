import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ButtonComponent, ModalComponent } from '@shared/components/ui';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserResponse } from '@task-manager-system/api-types';

@Component({
  selector: 'app-user-delete-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Eliminar Usuario"
      size="md"
      (closed)="handleClose()"
    >
      @if (user()) {
        <div class="space-y-4">
          <div
            class="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
              />
            </svg>
          </div>

          <div class="text-center">
            <p class="text-sm font-semibold text-white">
              ¿Estás seguro de revocar el acceso a este usuario?
            </p>
            <p class="text-xs text-slate-400 mt-1">
              Se eliminará de forma permanente al usuario
              <strong class="text-slate-200">"{{ user()?.name }}"</strong> ({{
                user()?.email
              }}). Sus tareas asignadas quedarán sin responsable.
            </p>
          </div>

          <!-- Action Buttons in Modal Footer -->
          <div
            modal-footer
            class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800"
          >
            <app-button
              type="button"
              variant="outline"
              size="md"
              (clicked)="handleClose()"
            >
              Cancelar
            </app-button>

            <app-button
              type="button"
              variant="danger"
              size="md"
              (clicked)="handleConfirm()"
            >
              Sí, Eliminar Usuario
            </app-button>
          </div>
        </div>
      }
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeleteModalComponent {
  private readonly usersSvc = inject(UserService);
  private readonly queryClient = inject(QueryClient);
  readonly isOpen = input.required<boolean>();
  readonly user = input<UserResponse | null>(null);
  readonly close = output<void>();

  readonly deleteUserConfirm = injectMutation(() => ({
    mutationFn: (userId: string) =>
      firstValueFrom(this.usersSvc.deleteUser(userId)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['/users'] }),
  }));

  handleClose(): void {
    this.close.emit();
  }

  async handleConfirm(): Promise<void> {
    await this.deleteUserConfirm.mutate(this.user()!.id!);
    this.handleClose();
  }
}
