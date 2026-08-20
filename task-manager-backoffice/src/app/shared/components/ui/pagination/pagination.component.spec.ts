import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent],
    });

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and calculate total pages correctly', () => {
    fixture.componentRef.setInput('totalItems', 50);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    const summary = fixture.debugElement.query(
      By.css('.text-xs.text-slate-400'),
    ).nativeElement;
    expect(summary.textContent).toContain('1 - 10');
    expect(summary.textContent).toContain('50');
  });

  it('should emit pageChange when clicking next and page buttons', () => {
    const pageChangeSpy = spyOn(component.pageChange, 'emit');
    fixture.componentRef.setInput('totalItems', 50);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    // Next button is the last one
    const nextBtn = buttons[buttons.length - 1];
    nextBtn.nativeElement.click();
    fixture.detectChanges();

    expect(pageChangeSpy).toHaveBeenCalledWith(2);
  });

  it('should disable previous button on first page and next button on last page', () => {
    fixture.componentRef.setInput('totalItems', 10);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const prevBtn = buttons[0];
    const nextBtn = buttons[buttons.length - 1];

    expect(prevBtn.nativeElement.disabled).toBeTrue();
    expect(nextBtn.nativeElement.disabled).toBeTrue();
  });

  it('should handle 0 total items gracefully', () => {
    fixture.componentRef.setInput('totalItems', 0);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const summary = fixture.debugElement.query(
      By.css('.text-xs.text-slate-400'),
    ).nativeElement;
    expect(summary.textContent).toContain('0 - 0');
  });
});
