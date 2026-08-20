import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';
import { By } from '@angular/platform-browser';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormFieldComponent],
    });

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and required asterisk when required is true', () => {
    fixture.componentRef.setInput('label', 'Correo electrónico');
    fixture.componentRef.setInput('forId', 'email-input');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain('Correo electrónico');
    expect(labelEl.attributes['for']).toBe('email-input');

    const asterisk = fixture.debugElement.query(By.css('span.text-rose-400'));
    expect(asterisk).toBeTruthy();
  });

  it('should not render label if label input is empty', () => {
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('label'));
    expect(labelEl).toBeNull();
  });

  it('should display string error message when error is provided', () => {
    fixture.componentRef.setInput('error', 'Campo obligatorio');
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('p.text-rose-400'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Campo obligatorio');
  });

  it('should display hint when no error and hint is provided', () => {
    fixture.componentRef.setInput('error', null);
    fixture.componentRef.setInput('hint', 'Mínimo 8 caracteres');
    fixture.detectChanges();

    const hintEl = fixture.debugElement.query(By.css('p.text-slate-400'));
    expect(hintEl).toBeTruthy();
    expect(hintEl.nativeElement.textContent).toContain('Mínimo 8 caracteres');
  });

  it('should apply customClass to container', () => {
    fixture.componentRef.setInput('customClass', 'custom-test-class');
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.space-y-1\\.5'));
    expect(container.classes['custom-test-class']).toBeTrue();
  });
});
