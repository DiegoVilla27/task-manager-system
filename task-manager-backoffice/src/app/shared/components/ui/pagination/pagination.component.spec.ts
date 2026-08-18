import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalItems', 30);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pageChange when a page number button is clicked', () => {
    let selectedPage = 1;
    component.pageChange.subscribe((p) => {
      selectedPage = p;
    });

    const pageButtons = fixture.nativeElement.querySelectorAll('button');
    // Click page 2 button
    const page2Btn = Array.from(pageButtons).find(
      (btn) => (btn as HTMLElement).textContent?.trim() === '2',
    ) as HTMLButtonElement;
    page2Btn?.click();

    expect(selectedPage).toBe(2);
  });

  it('should emit pageChange on next/prev navigation', () => {
    let selectedPage = 1;
    component.pageChange.subscribe((p) => {
      selectedPage = p;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const nextBtn = Array.from(buttons).find((b) =>
      (b as HTMLElement).textContent?.trim().includes('Siguiente'),
    ) as HTMLButtonElement;
    nextBtn?.click();
    expect(selectedPage).toBe(2);
  });
});
