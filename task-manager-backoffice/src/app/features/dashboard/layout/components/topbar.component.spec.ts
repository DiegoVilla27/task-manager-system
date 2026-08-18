import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { AuthService } from '@features/auth/services/auth.service';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'logout',
    ]);

    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidebar output on button click', () => {
    let emitted = false;
    component.toggleSidebar.subscribe(() => {
      emitted = true;
    });

    const toggleBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Alternar barra lateral"]',
    );
    toggleBtn?.click();
    expect(emitted).toBeTrue();
  });

  it('should emit toggleUserMenu output on user menu click', () => {
    let emitted = false;
    component.toggleUserMenu.subscribe(() => {
      emitted = true;
    });

    const userMenuBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Abrir menú de usuario"]',
    );
    userMenuBtn?.click();
    expect(emitted).toBeTrue();
  });

  it('should render logout button and trigger authService.logout when isUserMenuOpen is true', () => {
    fixture.componentRef.setInput('isUserMenuOpen', true);
    fixture.detectChanges();

    const logoutBtn = fixture.nativeElement.querySelector(
      'button[title="Cerrar sesión"]',
    );
    expect(logoutBtn).toBeTruthy();
    logoutBtn?.click();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
