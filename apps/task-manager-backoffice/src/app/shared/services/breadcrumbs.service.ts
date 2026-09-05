import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Structural definition schema for singular breadcrumb trail items.
 */
export interface Breadcrumb {
  /** The human-readable navigation label configured within route metadata definitions. */
  label: string;
  /** The fully constructed relative target URL path used for routing redirects. */
  url: string;
}

/**
 * Global infrastructure singleton service responsible for mapping active routing paths into hierarchical tracking footprints.
 * Monitors router lifecycle mutations to dynamically emit synchronized path history updates using Angular Signals.
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * ⚡ GLOBAL STATE SIGNAL: Read-only reactive state collector holding the active navigation path segments hierarchy.
   */
  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  constructor() {
    // Escucha cada cambio de ruta completado
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        const root = this.route.root;
        this.breadcrumbs.set(this.buildBreadcrumbs(root));
      });
  }

  /**
   * Recursively parses the current absolute active route tree structure to construct chronological path arrays.
   *
   * @param route - The conceptual entry-point node branch to inspect under the active route state framework.
   * @param url - Incremental trailing accumulator parameter mapping path strings over tree iterations.
   * @param breadcrumbs - Mutable collection array storing matching operational metadata outputs.
   * @returns An organized collection listing active route segments mapped up to the current active viewport.
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    const child = route.firstChild;

    if (!child) {
      return breadcrumbs;
    }

    const routeURL: string = child.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    const nextUrl = routeURL !== '' ? `${url}/${routeURL}` : url;
    const label = child.snapshot.data['breadcrumb'];

    // Si la ruta configuró una etiqueta de breadcrumb, la agregamos
    if (label) {
      breadcrumbs.push({ label, url: nextUrl || '/' });
    }

    return this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
  }
}
