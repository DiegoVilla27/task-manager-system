import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputComponent],
    });

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and register ControlValueAccessor', () => {
    expect(component).toBeTruthy();
    const accessors = fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    expect(accessors).toBeDefined();
    expect(accessors).toContain(component);
  });

  it('should update input value and emit valueChange on input event', () => {
    const valueChangeSpy = spyOn(component.valueChange, 'emit');
    const onChangeSpy = jasmine.createSpy('onChangeSpy');
    component.registerOnChange(onChangeSpy);

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = 'Nuevo texto';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalledWith('Nuevo texto');
    expect(valueChangeSpy).toHaveBeenCalledWith('Nuevo texto');
  });

  it('should write value correctly via ControlValueAccessor', () => {
    component.writeValue('Valor inicial');
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.value).toBe('Valor inicial');
  });

  it('should emit focused and blurred events', () => {
    const focusSpy = spyOn(component.focused, 'emit');
    const blurSpy = spyOn(component.blurred, 'emit');
    const onTouchedSpy = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouchedSpy);

    const inputDebug = fixture.debugElement.query(By.css('input'));
    inputDebug.triggerEventHandler('focus', new FocusEvent('focus'));
    inputDebug.triggerEventHandler('blur', new FocusEvent('blur'));
    fixture.detectChanges();

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(blurSpy).toHaveBeenCalledTimes(1);
    expect(onTouchedSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state via input and CVA setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.disabled).toBeTrue();
  });

  it('should apply error and size classes properly', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('error', 'Error en el campo');
    fixture.componentRef.setInput('hasPrefix', true);
    fixture.componentRef.setInput('hasSuffix', true);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.className).toContain('h-12');
    expect(inputEl.className).toContain('border-rose-500');
    expect(inputEl.className).toContain('pl-10');
    expect(inputEl.className).toContain('pr-11');
  });
});
