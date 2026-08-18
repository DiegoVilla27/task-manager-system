import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BackofficeLayoutComponent } from './backoffice-layout.component';

describe('BackofficeLayoutComponent', () => {
  let component: BackofficeLayoutComponent;
  let fixture: ComponentFixture<BackofficeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeLayoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackofficeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar state', () => {
    expect(component.isSidebarCollapsed()).toBeFalse();
    component.toggleSidebar();
    expect(component.isSidebarCollapsed()).toBeTrue();
    component.toggleSidebar();
    expect(component.isSidebarCollapsed()).toBeFalse();
  });

  it('should toggle user menu', () => {
    expect(component.isUserMenuOpen()).toBeFalse();
    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBeTrue();
    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBeFalse();
  });
});
