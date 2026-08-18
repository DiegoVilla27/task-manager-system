import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle CVA writeValue, registerOnChange, registerOnTouched, setDisabledState', () => {
    let changedValue = '';
    let touched = false;

    component.registerOnChange((val: string) => {
      changedValue = val;
    });
    component.registerOnTouched(() => {
      touched = true;
    });

    component.writeValue('Test value');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.value).toBe('Test value');

    input.value = 'Updated value';
    input.dispatchEvent(new Event('input'));
    expect(changedValue).toBe('Updated value');

    input.dispatchEvent(new FocusEvent('blur'));
    expect(touched).toBeTrue();

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(input.disabled).toBeTrue();
  });

  it('should emit focused and blurred events', () => {
    let focusEmitted = false;
    let blurEmitted = false;

    component.focused.subscribe(() => {
      focusEmitted = true;
    });
    component.blurred.subscribe(() => {
      blurEmitted = true;
    });

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));

    expect(focusEmitted).toBeTrue();
    expect(blurEmitted).toBeTrue();
  });

  it('should apply error classes when error input is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    expect(input.className).toContain('border-rose-500');
  });
});
