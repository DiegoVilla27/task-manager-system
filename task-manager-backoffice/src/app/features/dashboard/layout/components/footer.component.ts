import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer
      class="h-10 w-full shrink-0 bg-slate-900/95 border-t border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-20 text-xs text-slate-400"
    >
      <div class="flex items-center gap-3">
        <span class="text-slate-300 font-semibold">TaskManager Backoffice</span>
        <span class="text-slate-600">|</span>
        <span class="text-[11px] text-slate-500">v1.0.0</span>
        <span class="hidden sm:inline text-slate-600">|</span>
        <span class="hidden sm:inline text-[11px] text-slate-500">
          Arquitectura OnPush & Tailwind v4
        </span>
      </div>

      <div class="flex items-center gap-4 text-[11px]">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span class="text-slate-400">Estado del Sistema: 100% Operativo</span>
        </span>
        <span class="hidden md:inline text-slate-600">|</span>
        <span class="hidden md:inline text-slate-500">© 2026 TaskManager</span>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
