import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { By } from '@angular/platform-browser';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AvatarComponent],
    });

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render with default values', () => {
    expect(fixture.nativeElement).toBeDefined();
  });

  it('should render with initials', () => {
    fixture.componentRef.setInput('initials', 'DV');
    fixture.detectChanges();

    const initialsDiv = fixture.debugElement.query(
      By.css('[aria-label="Avatar"]'),
    );

    expect(component.initials()).toEqual('DV');
    expect(initialsDiv.nativeElement.textContent.trim()).toEqual('DV');
  });

  it('should render with initials name', () => {
    fixture.componentRef.setInput('name', 'Mi Avatar');
    fixture.detectChanges();

    const nameDiv = fixture.debugElement.query(By.css('[title="Mi Avatar"]'));

    expect(component.name()).toEqual('Mi Avatar');
    expect(nameDiv.nativeElement.textContent.trim()).toEqual('MA');
  });

  it('should render with initials name with one letter', () => {
    fixture.componentRef.setInput('name', 'Diego');
    fixture.detectChanges();

    const nameDiv = fixture.debugElement.query(By.css('[title="Diego"]'));

    expect(component.name()).toEqual('Diego');
    expect(nameDiv.nativeElement.textContent.trim()).toEqual('DI');
  });

  it('should render with status', () => {
    fixture.componentRef.setInput('status', 'online');
    fixture.detectChanges();

    const statusSpan = fixture.debugElement.query(By.css('span'));

    expect(component.status()).toEqual('online');
    expect(statusSpan.classes['bg-emerald-400']).toBeTrue();
  });

  it('should evaluate statusClasses with empty color when status is null', () => {
    fixture.componentRef.setInput('status', null);
    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();

    // Forzamos la lectura del computed protegido para disparar la rama false
    const classes = (component as any).statusClasses();

    expect(classes).toBe('w-2.5 h-2.5');

    // Opcional: verificar que el span ni siquiera existe en el DOM
    const statusSpan = fixture.debugElement.query(By.css('span'));
    expect(statusSpan).toBeNull();
  });
});
