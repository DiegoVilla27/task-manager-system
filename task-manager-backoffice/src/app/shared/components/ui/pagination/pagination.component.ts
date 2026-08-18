import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="text-xs text-slate-400">
        Mostrando
        <span class="font-semibold text-white"
          >{{ fromIndex() }} - {{ toIndex() }}</span
        >
        de <span class="font-semibold text-white">{{ totalItems() }}</span>
        {{ itemLabel() }}
      </div>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          [disabled]="currentPage() <= 1"
          (click)="goToPage(currentPage() - 1)"
          class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:hover:text-slate-400 text-xs transition-colors cursor-pointer"
        >
          Anterior
        </button>

        @for (p of pages(); track p) {
          <button
            type="button"
            (click)="goToPage(p)"
            [class]="
              p === currentPage()
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            "
            class="px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            {{ p }}
          </button>
        }

        <button
          type="button"
          [disabled]="currentPage() >= totalPages()"
          (click)="goToPage(currentPage() + 1)"
          class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:hover:text-slate-400 text-xs transition-colors cursor-pointer"
        >
          Siguiente
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly currentPage = input<number>(1);
  readonly totalItems = input<number>(0);
  readonly itemsPerPage = input<number>(5);
  readonly itemLabel = input<string>('elementos');

  readonly pageChange = output<number>();

  protected readonly totalPages = computed(() => {
    const total = this.totalItems();
    const perPage = this.itemsPerPage() || 1;
    return Math.max(1, Math.ceil(total / perPage));
  });

  protected readonly fromIndex = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.itemsPerPage() + 1;
  });

  protected readonly toIndex = computed(() => {
    return Math.min(
      this.currentPage() * this.itemsPerPage(),
      this.totalItems(),
    );
  });

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pageList: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pageList.push(i);
    }

    return pageList;
  });

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
