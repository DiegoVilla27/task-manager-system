import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
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

  it('should emit searchChange with debounce on input', fakeAsync(() => {
    let emittedQuery = '';
    component.searchChange.subscribe((q) => {
      emittedQuery = q;
    });

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emittedQuery).toBe('');

    tick(399);
    expect(emittedQuery).toBe('');

    tick(1);
    expect(emittedQuery).toBe('Angular');
  }));

  it('should clear value and immediately emit cleared and searchChange when clear button is clicked', () => {
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
