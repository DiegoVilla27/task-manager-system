import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render expanded sidebar by default', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Gestión de Usuarios');
    expect(fixture.nativeElement.textContent).toContain('Gestión de Tareas');
    expect(fixture.nativeElement.textContent).toContain('Módulos del Sistema');
  });

  it('should adjust layout when collapsed', () => {
    fixture.componentRef.setInput('isCollapsed', true);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('w-20')).toBeTrue();
  });
});
