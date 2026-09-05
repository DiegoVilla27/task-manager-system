import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';
import { By } from '@angular/platform-browser';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BadgeComponent],
    });

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render with dots', () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('dot', true);
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();

    const dotSpan = fixture.debugElement.query(By.css('.bg-indigo-400'));
    expect(dotSpan).toBeTruthy();
  });

  it('should render with dots with default variant fallback', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.componentRef.setInput('variant', 'hi');
    fixture.detectChanges();

    const dotSpan = fixture.debugElement.query(By.css('.bg-slate-400'));
    expect(dotSpan).toBeTruthy();
  });
});
