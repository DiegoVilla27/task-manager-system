import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
