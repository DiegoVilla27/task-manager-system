import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackofficeLayoutComponent } from './backoffice-layout.component';
import { provideRouter } from '@angular/router';

describe('BackofficeLayoutComponent', () => {
  let component: BackofficeLayoutComponent;
  let fixture: ComponentFixture<BackofficeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeLayoutComponent],
      providers: [provideRouter([])],
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
  });

  it('should toggle user menu', () => {
    expect(component.isUserMenuOpen()).toBeFalse();
    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBeTrue();
  });
});
