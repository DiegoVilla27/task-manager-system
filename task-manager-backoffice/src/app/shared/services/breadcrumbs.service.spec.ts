import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Router,
  provideRouter,
} from '@angular/router';
import { Subject } from 'rxjs';
import { BreadcrumbService } from './breadcrumbs.service';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let routerEvents$: Subject<Event>;

  beforeEach(() => {
    routerEvents$ = new Subject<Event>();

    const usersChild = {
      snapshot: {
        url: [{ path: 'users' }],
        data: { breadcrumb: 'Usuarios' },
      },
      firstChild: null,
    };

    const dashboardChild = {
      snapshot: {
        url: [{ path: 'dashboard' }],
        data: { breadcrumb: 'Dashboard' },
      },
      firstChild: usersChild,
    };

    const mockActivatedRoute = {
      root: {
        firstChild: dashboardChild,
      },
    };

    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const router = TestBed.inject(Router);
    spyOnProperty(router, 'events', 'get').and.returnValue(
      routerEvents$.asObservable(),
    );

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build hierarchical breadcrumbs when NavigationEnd fires', () => {
    routerEvents$.next(
      new NavigationEnd(1, '/dashboard/users', '/dashboard/users'),
    );

    expect(service.breadcrumbs()).toEqual([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Usuarios', url: '/dashboard/users' },
    ]);
  });
});
