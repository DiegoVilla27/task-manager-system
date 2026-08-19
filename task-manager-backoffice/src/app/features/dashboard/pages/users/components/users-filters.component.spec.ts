import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersFiltersComponent } from './users-filters.component';

describe('UsersFiltersComponent', () => {
  let component: UsersFiltersComponent;
  let fixture: ComponentFixture<UsersFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange event when input changes', () => {
    let emitted = '';
    component.searchChange.subscribe((val) => {
      emitted = val;
    });

    const searchInput = fixture.nativeElement.querySelector(
      'app-search-input input',
    );
    searchInput.value = 'Diego';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emitted).toBe('Diego');
  });

  it('should emit clearFilters event when clear button is clicked', () => {
    let cleared = false;
    component.clearFilters.subscribe(() => {
      cleared = true;
    });

    const button = fixture.nativeElement.querySelector('app-button button');
    button.click();
    fixture.detectChanges();

    expect(cleared).toBeTrue();
  });
});
