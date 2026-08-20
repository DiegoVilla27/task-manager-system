import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
    });

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render footer content', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(
      'TaskManager Backoffice',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Estado del Sistema: 100% Operativo',
    );
  });
});
