import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  const options: SelectOption[] = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options and handle selection changes', () => {
    let changedValue: unknown = null;
    let touched = false;

    component.registerOnChange((val: unknown) => {
      changedValue = val;
    });
    component.registerOnTouched(() => {
      touched = true;
    });

    component.writeValue('b');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;
    expect(select.value).toBe('b');

    select.value = 'a';
    select.dispatchEvent(new Event('change'));
    expect(changedValue).toBe('a');

    select.dispatchEvent(new FocusEvent('blur'));
    expect(touched).toBeTrue();
  });

  it('should handle placeholder option when provided', () => {
    fixture.componentRef.setInput('placeholder', 'Selecciona una opción');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;
    expect(select.options[0].text).toBe('Selecciona una opción');
  });

  it('should handle disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector(
      'select',
    ) as HTMLSelectElement;
    expect(select.disabled).toBeTrue();
  });
});
