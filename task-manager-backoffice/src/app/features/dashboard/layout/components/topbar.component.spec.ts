import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';
import { AuthService } from '@features/auth/services/auth.service';
import { By } from '@angular/platform-browser';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidebar when sidebar toggle button is clicked', () => {
    const toggleSidebarSpy = spyOn(component.toggleSidebar, 'emit');
    const toggleBtn = fixture.debugElement.query(
      By.css('button[aria-label="Alternar barra lateral"]'),
    );

    toggleBtn.nativeElement.click();
    fixture.detectChanges();

    expect(toggleSidebarSpy).toHaveBeenCalled();
  });

  it('should emit toggleUserMenu when user profile dropdown button is clicked', () => {
    const toggleUserMenuSpy = spyOn(component.toggleUserMenu, 'emit');
    const userBtn = fixture.debugElement.query(
      By.css('button[aria-label="Abrir menú de usuario"]'),
    );

    userBtn.nativeElement.click();
    fixture.detectChanges();

    expect(toggleUserMenuSpy).toHaveBeenCalled();
  });

  it('should show user menu dropdown when isUserMenuOpen is true and call authService.logout', () => {
    fixture.componentRef.setInput('isUserMenuOpen', true);
    fixture.detectChanges();

    const logoutBtn = fixture.debugElement.query(
      By.css('button[aria-label="Cerrar sesión"]'),
    );
    expect(logoutBtn).toBeTruthy();

    logoutBtn.nativeElement.click();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
