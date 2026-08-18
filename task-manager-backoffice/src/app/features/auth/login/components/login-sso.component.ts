import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/ui';

@Component({
  selector: 'app-login-sso',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="mt-6">
      <div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-slate-800"></div>
        <span
          class="flex-shrink mx-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
        >
          O ingresar con SSO
        </span>
        <div class="flex-grow border-t border-slate-800"></div>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-4">
        <app-button
          variant="outline"
          size="sm"
          (clicked)="ssoSelect.emit('github')"
          customClass="w-full bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
        >
          <svg
            class="w-4 h-4 text-indigo-400 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          <span>GitHub Org</span>
        </app-button>

        <app-button
          variant="outline"
          size="sm"
          (clicked)="ssoSelect.emit('okta')"
          customClass="w-full bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
        >
          <svg
            class="w-4 h-4 text-cyan-400 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"
            />
          </svg>
          <span>Okta SSO</span>
        </app-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginSsoComponent {
  readonly ssoSelect = output<'github' | 'okta'>();
}
