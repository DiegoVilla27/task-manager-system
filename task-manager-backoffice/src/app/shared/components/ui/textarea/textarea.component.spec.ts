import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle CVA writeValue, input changes, and blur', () => {
    let changedValue = '';
    let touched = false;

    component.registerOnChange((val: string) => {
      changedValue = val;
    });
    component.registerOnTouched(() => {
      touched = true;
    });

    component.writeValue('Initial text');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe('Initial text');

    textarea.value = 'New text content';
    textarea.dispatchEvent(new Event('input'));
    expect(changedValue).toBe('New text content');

    textarea.dispatchEvent(new FocusEvent('blur'));
    expect(touched).toBeTrue();
  });

  it('should apply error classes when error is true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(textarea.className).toContain('border-rose-500');
  });

  it('should handle disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(textarea.disabled).toBeTrue();
  });
});
