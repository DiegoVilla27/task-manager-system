import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { UsersFiltersComponent } from './users-filters.component';

describe('UsersFiltersComponent', () => {
  let component: UsersFiltersComponent;
  let fixture: ComponentFixture<UsersFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersFiltersComponent],
    });

    fixture = TestBed.createComponent(UsersFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and emit clearFilters when clear button is clicked', () => {
    const clearFiltersSpy = spyOn(component.clearFilters, 'emit');
    const button = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(clearFiltersSpy).toHaveBeenCalled();
  });

  it('should emit searchChange event when input changes with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchChange, 'emit');
    const searchInput = fixture.nativeElement.querySelector('input');
    searchInput.value = 'Diego';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(searchSpy).not.toHaveBeenCalled();
    tick(400);
    expect(searchSpy).toHaveBeenCalledWith('Diego');
  }));
});
