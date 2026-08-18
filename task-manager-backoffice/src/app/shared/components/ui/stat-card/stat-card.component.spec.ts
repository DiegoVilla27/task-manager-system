import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Tareas Activas');
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and value', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Tareas Activas');
    expect(text).toContain('42');
  });

  it('should render subtitle and trend when provided', () => {
    fixture.componentRef.setInput('subtitle', '+5 esta semana');
    fixture.componentRef.setInput('trend', 'up');
    fixture.componentRef.setInput('trendText', '+12%');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('+12%');
  });
});
