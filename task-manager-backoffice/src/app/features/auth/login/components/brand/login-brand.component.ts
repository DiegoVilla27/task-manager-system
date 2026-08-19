import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideClipboardPen } from '@lucide/angular';

@Component({
  selector: 'app-login-brand',
  standalone: true,
  imports: [CommonModule, LucideClipboardPen],
  template: `
    <div class="text-center mb-8">
      <div
        class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-xl shadow-indigo-500/25 mb-4 ring-4 ring-indigo-500/10"
      >
        <svg class="w-7 h-7 text-white" lucideClipboardPen></svg>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        TaskManager Backoffice
      </h1>
      <p class="text-sm text-slate-400 mt-2">
        Acceso restringido para administradores y operadores
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginBrandComponent {}
