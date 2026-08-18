import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render indicator dot when dot is true', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();

    const dot = fixture.nativeElement.querySelector('.rounded-full');
    expect(dot).toBeTruthy();
  });

  it('should apply pulse animation when pulse is true', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.componentRef.setInput('pulse', true);
    fixture.detectChanges();

    const pulse = fixture.nativeElement.querySelector('.animate-pulse');
    expect(pulse).toBeTruthy();
  });

  it('should apply success variant classes', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span');
    expect(badge.className).toContain('emerald');
  });

  it('should apply warning variant classes', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span');
    expect(badge.className).toContain('amber');
  });
});
