import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumbs.service';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  UrlSegment,
} from '@angular/router';
import { Subject } from 'rxjs';

describe('BreadcrumbService', () => {
  let breadcrumbSvc: BreadcrumbService;
  let routerEvents$: Subject<unknown>;
  let routerActivatedMock: any;

  beforeEach(() => {
    routerEvents$ = new Subject();
    routerActivatedMock = {
      root: {
        firstChild: null,
      },
    };

    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
          },
        },
        { provide: ActivatedRoute, useValue: routerActivatedMock },
      ],
    });

    breadcrumbSvc = TestBed.inject(BreadcrumbService);
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('should init with breadcrumbs empty', () => {
    expect(breadcrumbSvc.breadcrumbs()).toEqual([]);
  });

  it('should ignore non-NavigationEnd router events (e.g. NavigationStart)', () => {
    // Emitir un evento que no sea NavigationEnd
    routerEvents$.next(new NavigationStart(1, '/users'));

    // No debe haber cambios en el signal
    expect(breadcrumbSvc.breadcrumbs()).toEqual([]);
  });

  it('should build hierarchical breadcrumbs on NavigationEnd', () => {
    // Arrange: Simular el árbol de rutas: /users -> /users/123 (Detalle)
    // Nodo nieto (/123)
    const childLevel2 = {
      snapshot: {
        url: [new UrlSegment('123', {})],
        data: { breadcrumb: 'Detalle de Usuario' },
      },
      firstChild: null,
    };

    // Nodo hijo (/users)
    const childLevel1 = {
      snapshot: {
        url: [new UrlSegment('users', {})],
        data: { breadcrumb: 'Usuarios' },
      },
      firstChild: childLevel2,
    };

    // Asignar el árbol al root de ActivatedRoute
    routerActivatedMock.root = {
      firstChild: childLevel1,
    };

    // Act: Disparar el evento NavigationEnd
    routerEvents$.next(new NavigationEnd(1, '/users/123', '/users/123'));

    // Assert: Comprobamos el Signal
    expect(breadcrumbSvc.breadcrumbs()).toEqual([
      { label: 'Usuarios', url: '/users' },
      { label: 'Detalle de Usuario', url: '/users/123' },
    ]);
  });

  it('should handle empty route path (root) and fallback to "/" for url', () => {
    // Arrange: Nodo raíz con path: '' y breadcrumb configurado
    const rootChild = {
      snapshot: {
        url: [], // 👈 Array vacío: routeURL = '', dispara el else del ternario (nextUrl = '')
        data: { breadcrumb: 'Inicio' }, // 👈 Tiene label con nextUrl = '', dispara fallback '/'
      },
      firstChild: null,
    };

    routerActivatedMock.root = {
      firstChild: rootChild,
    };

    // Act: Disparar evento de navegación a la raíz
    routerEvents$.next(new NavigationEnd(1, '/', '/'));

    // Assert: Verifica que la URL resultante sea '/'
    expect(breadcrumbSvc.breadcrumbs()).toEqual([
      { label: 'Inicio', url: '/' },
    ]);
  });
});
