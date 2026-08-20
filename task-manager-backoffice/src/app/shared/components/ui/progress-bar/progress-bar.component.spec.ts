import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';
import { By } from '@angular/platform-browser';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    });

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and calculate percentage correctly', () => {
    fixture.componentRef.setInput('value', 50);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('showLabel', true);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    const labelEl = fixture.debugElement.query(
      By.css('.font-mono'),
    ).nativeElement;
    expect(labelEl.textContent).toContain('50%');
  });

  it('should apply variant colors (success, warning, danger, auto)', () => {
    fixture.componentRef.setInput('value', 100);
    fixture.componentRef.setInput('variant', 'auto');
    fixture.detectChanges();

    let fillEl = fixture.debugElement.query(
      By.css('.rounded-full.transition-all'),
    ).nativeElement;
    expect(fillEl.className).toContain('bg-emerald-500');

    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    fillEl = fixture.debugElement.query(
      By.css('.rounded-full.transition-all'),
    ).nativeElement;
    expect(fillEl.className).toContain('bg-rose-500');
  });

  it('should clamp percentage between 0 and 100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('showLabel', true);
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(
      By.css('.font-mono'),
    ).nativeElement;
    expect(labelEl.textContent).toContain('100%');
  });
});
