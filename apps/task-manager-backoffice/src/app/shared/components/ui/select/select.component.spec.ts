import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';
import { By } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  const mockOptions: SelectOption[] = [
    { label: 'Opción 1', value: '1' },
    { label: 'Opción 2', value: '2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponent],
    });

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create and register ControlValueAccessor', () => {
    expect(component).toBeTruthy();
    const accessors = fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    expect(accessors).toContain(component);
  });

  it('should render options and placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Selecciona uno');
    fixture.detectChanges();

    const optionsEl = fixture.debugElement.queryAll(By.css('option'));
    expect(optionsEl.length).toBe(3); // placeholder + 2 options
    expect(optionsEl[0].nativeElement.textContent.trim()).toBe(
      'Selecciona uno',
    );
  });

  it('should emit valueChange and update CVA on selection change', () => {
    const valueChangeSpy = spyOn(component.valueChange, 'emit');
    const onChangeSpy = jasmine.createSpy('onChangeSpy');
    component.registerOnChange(onChangeSpy);

    const selectEl = fixture.debugElement.query(By.css('select')).nativeElement;
    selectEl.value = '2';
    selectEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalledWith('2');
    expect(valueChangeSpy).toHaveBeenCalledWith('2');
  });

  it('should write value and set disabled state', () => {
    component.writeValue('1');
    component.setDisabledState(true);
    fixture.detectChanges();

    const selectEl = fixture.debugElement.query(By.css('select')).nativeElement;
    expect(selectEl.value).toBe('1');
    expect(selectEl.disabled).toBeTrue();
  });

  it('should emit blurred on blur event', () => {
    const blurSpy = spyOn(component.blurred, 'emit');
    const onTouchedSpy = jasmine.createSpy('onTouchedSpy');
    component.registerOnTouched(onTouchedSpy);

    const selectDebug = fixture.debugElement.query(By.css('select'));
    selectDebug.triggerEventHandler('blur', new FocusEvent('blur'));
    fixture.detectChanges();

    expect(blurSpy).toHaveBeenCalled();
    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
