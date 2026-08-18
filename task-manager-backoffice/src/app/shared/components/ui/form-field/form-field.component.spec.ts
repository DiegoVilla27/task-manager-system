import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and required asterisk', () => {
    fixture.componentRef.setInput('label', 'Correo');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Correo');
    expect(label.textContent).toContain('*');
  });

  it('should render hint when provided and no error', () => {
    fixture.componentRef.setInput('hint', 'Ingresa tu correo');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Ingresa tu correo');
  });

  it('should render error message when error is provided', () => {
    fixture.componentRef.setInput('error', 'Campo inválido');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Campo inválido');
  });
});
