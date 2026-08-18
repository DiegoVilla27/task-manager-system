import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ModalComponent } from '@shared/components/ui';
import { UserMock } from '../models/user.model';

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
  readonly isOpen = input.required<boolean>();
  readonly user = input<UserMock | null>(null);

  readonly closed = output<void>();
  readonly confirmed = output<string>();

  handleClose(): void {
    this.closed.emit();
  }

  handleConfirm(): void {
    const current = this.user();
    if (current) {
      this.confirmed.emit(current.id);
      this.handleClose();
    }
  }
}
