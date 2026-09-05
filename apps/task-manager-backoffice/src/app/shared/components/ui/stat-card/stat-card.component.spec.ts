import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';
import { By } from '@angular/platform-browser';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatCardComponent],
    });

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
  });

  it('should create and render title and value', () => {
    fixture.componentRef.setInput('title', 'Total Usuarios');
    fixture.componentRef.setInput('value', 120);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    const titleEl = fixture.debugElement.query(
      By.css('.text-xs.font-semibold'),
    ).nativeElement;
    const valueEl = fixture.debugElement.query(
      By.css('.text-2xl.font-bold'),
    ).nativeElement;

    expect(titleEl.textContent).toContain('Total Usuarios');
    expect(valueEl.textContent).toContain('120');
  });

  it('should render dot and pulse when provided', () => {
    fixture.componentRef.setInput('title', 'Tareas');
    fixture.componentRef.setInput('value', 45);
    fixture.componentRef.setInput('dotColor', 'bg-emerald-400');
    fixture.componentRef.setInput('dotPulse', true);
    fixture.detectChanges();

    const dot = fixture.debugElement.query(
      By.css('.rounded-full.bg-emerald-400'),
    );
    expect(dot).toBeTruthy();
    expect(dot.classes['animate-pulse']).toBeTrue();
  });

  it('should render trend text and indicators for up and down', () => {
    fixture.componentRef.setInput('title', 'Tareas');
    fixture.componentRef.setInput('value', 45);
    fixture.componentRef.setInput('trend', 'up');
    fixture.componentRef.setInput('trendText', '+12% vs ayer');
    fixture.detectChanges();

    let trendEl = fixture.debugElement.query(By.css('.text-emerald-400'));
    expect(trendEl).toBeTruthy();
    expect(trendEl.nativeElement.textContent).toContain('+12% vs ayer');

    fixture.componentRef.setInput('trend', 'down');
    fixture.componentRef.setInput('trendText', '-5%');
    fixture.detectChanges();

    trendEl = fixture.debugElement.query(By.css('.text-rose-400'));
    expect(trendEl).toBeTruthy();
  });

  it('should render subtitle when no trendText is provided', () => {
    fixture.componentRef.setInput('title', 'Tareas');
    fixture.componentRef.setInput('value', 45);
    fixture.componentRef.setInput('subtitle', 'Actualizado hace 5 min');
    fixture.detectChanges();

    const subEl = fixture.debugElement.query(
      By.css('.text-\\[11px\\]'),
    ).nativeElement;
    expect(subEl.textContent).toContain('Actualizado hace 5 min');
  });
});
