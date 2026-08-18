import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle CVA writeValue, toggle change and blur', () => {
    let changedValue = false;
    let touched = false;

    component.registerOnChange((val: boolean) => {
      changedValue = val;
    });
    component.registerOnTouched(() => {
      touched = true;
    });

    component.writeValue(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.checked).toBeTrue();

    input.checked = false;
    input.dispatchEvent(new Event('change'));
    expect(changedValue).toBeFalse();

    input.dispatchEvent(new FocusEvent('blur'));
    expect(touched).toBeTrue();
  });

  it('should display label and description when provided', () => {
    fixture.componentRef.setInput('label', 'Acepto términos');
    fixture.componentRef.setInput('description', 'Descripción detallada');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Acepto términos');
    expect(text).toContain('Descripción detallada');
  });

  it('should handle disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.disabled).toBeTrue();
  });
});
