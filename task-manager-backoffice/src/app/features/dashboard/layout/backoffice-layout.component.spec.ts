import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackofficeLayoutComponent } from './backoffice-layout.component';
import { AuthService } from '@features/auth/services/auth.service';
import { provideRouter } from '@angular/router';

describe('BackofficeLayoutComponent', () => {
  let component: BackofficeLayoutComponent;
  let fixture: ComponentFixture<BackofficeLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      imports: [BackofficeLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(BackofficeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar and user menu flags', () => {
    expect(component.isSidebarCollapsed()).toBeFalse();
    component.toggleSidebar();
    expect(component.isSidebarCollapsed()).toBeTrue();

    expect(component.isUserMenuOpen()).toBeFalse();
    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBeTrue();
  });
});
