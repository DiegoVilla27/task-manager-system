import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let debug: DebugElement;
  let input: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckboxComponent],
    });

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement;
    input = debug.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should provide NG_VALUE_ACCESSOR that resolves to CheckboxComponent instance', () => {
    // Obtenemos los ValueAccessors registrados en el inyector del componente
    const accessors = fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);

    // Assert: verificamos que exista y que la instancia sea el componente actual
    expect(accessors).toBeDefined();
    expect(accessors).toContain(component);
  });

  it('should render with default values', () => {
    expect(input.nativeElement.checked).toBeFalse();
  });

  it('should change checked to true', () => {
    const onChangeSpy = jasmine.createSpy('onChangeSpy');
    const checkedChangeSpy = spyOn(component.checkedChange, 'emit');

    const inputEl = input.nativeElement;
    inputEl.checked = true;
    input.triggerEventHandler('change', { target: inputEl });
    component.registerOnChange(onChangeSpy);
    fixture.detectChanges();

    expect(checkedChangeSpy).toHaveBeenCalledTimes(1);
    expect(checkedChangeSpy).toHaveBeenCalledWith(true);
  });

  it('should write input', () => {
    component.writeValue(true);
    fixture.detectChanges();

    expect(input.nativeElement.checked).toBeTrue();
  });

  it('should blur in checkbox', () => {
    const onTouchedSpy = jasmine.createSpy('onChangeSpy');
    const blurredSpy = spyOn(component.blurred, 'emit');

    input.triggerEventHandler('blur', new FocusEvent('blur'));
    component.registerOnTouched(onTouchedSpy);
    fixture.detectChanges();

    expect(blurredSpy).toHaveBeenCalledTimes(1);
    expect(blurredSpy).toHaveBeenCalledWith(new FocusEvent('blur'));
  });

  it('should render disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(input.nativeElement.disabled).toBeTrue();
  });
});
