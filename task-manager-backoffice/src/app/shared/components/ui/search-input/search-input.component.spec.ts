import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange on input', () => {
    let emittedQuery = '';
    component.searchChange.subscribe((q) => {
      emittedQuery = q;
    });

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));

    expect(emittedQuery).toBe('Angular');
  });

  it('should clear value and emit cleared and searchChange when clear button is clicked', () => {
    let clearedCalled = false;
    let emittedQuery = 'initial';

    component.cleared.subscribe(() => {
      clearedCalled = true;
    });
    component.searchChange.subscribe((q) => {
      emittedQuery = q;
    });

    fixture.componentRef.setInput('value', 'Hello');
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector('button');
    expect(clearBtn).toBeTruthy();
    clearBtn.click();

    expect(clearedCalled).toBeTrue();
    expect(emittedQuery).toBe('');
  });
});
