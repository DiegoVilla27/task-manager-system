import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginBrandComponent } from './components/brand/login-brand.component';
import { LoginFormComponent } from './components/form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginBrandComponent, LoginFormComponent],

  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden"
    >
      <!-- Background Glow & Grid Ornaments -->
      <div
        class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-137.5 bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-87.5 h-87.5 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-25 pointer-events-none"
      ></div>

      <!-- Login Card Container Orchestrator -->
      <div class="w-full max-w-md relative z-10">
        <app-login-brand />

        <app-login-form />

        <!-- Security & System Notice Footer -->
        <div class="mt-6 text-center">
          <p class="text-xs text-slate-500">
            Task Manager Backoffice v1.0.0 · © 2026 Todos los derechos
            reservados
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
