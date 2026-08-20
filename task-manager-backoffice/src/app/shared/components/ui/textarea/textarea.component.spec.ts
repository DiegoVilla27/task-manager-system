import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { By } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextareaComponent],
    });

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and register ControlValueAccessor', () => {
    expect(component).toBeTruthy();
    const accessors = fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    expect(accessors).toContain(component);
  });

  it('should emit valueChange and call onChange on textarea input', () => {
    const valueChangeSpy = spyOn(component.valueChange, 'emit');
    const onChangeSpy = jasmine.createSpy('onChangeSpy');
    component.registerOnChange(onChangeSpy);

    const textarea = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    textarea.value = 'Texto de descripción';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalledWith('Texto de descripción');
    expect(valueChangeSpy).toHaveBeenCalledWith('Texto de descripción');
  });

  it('should write value and handle disabled state', () => {
    component.writeValue('Contenido inicial');
    component.setDisabledState(true);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textarea.value).toBe('Contenido inicial');
    expect(textarea.disabled).toBeTrue();
  });

  it('should emit blurred on blur event', () => {
    const blurSpy = spyOn(component.blurred, 'emit');
    const onTouchedSpy = jasmine.createSpy('onTouchedSpy');
    component.registerOnTouched(onTouchedSpy);

    const textareaDebug = fixture.debugElement.query(By.css('textarea'));
    textareaDebug.triggerEventHandler('blur', new FocusEvent('blur'));
    fixture.detectChanges();

    expect(blurSpy).toHaveBeenCalled();
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should apply error class when error input is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    expect(textarea.className).toContain('border-rose-500');
  });
});
