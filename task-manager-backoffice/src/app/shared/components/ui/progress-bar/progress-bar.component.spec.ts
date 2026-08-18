import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clamp progress percentage between 0 and 100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();

    const bar = fixture.nativeElement.querySelector(
      '.rounded-full.transition-all',
    );
    expect(bar.style.width).toBe('100%');

    fixture.componentRef.setInput('value', -20);
    fixture.detectChanges();
    expect(bar.style.width).toBe('0%');
  });

  it('should display label when showLabel is true', () => {
    fixture.componentRef.setInput('value', 65);
    fixture.componentRef.setInput('showLabel', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('span');
    expect(label.textContent).toContain('Avance');
  });

  it('should calculate color based on percentage when variant is auto', () => {
    fixture.componentRef.setInput('variant', 'auto');
    fixture.componentRef.setInput('value', 100);
    fixture.detectChanges();

    const bar = fixture.nativeElement.querySelector(
      '.rounded-full.transition-all',
    );
    expect(bar.className).toContain('emerald');
  });
});
