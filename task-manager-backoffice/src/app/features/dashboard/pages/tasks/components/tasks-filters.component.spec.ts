import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksFiltersComponent } from './tasks-filters.component';

describe('TasksFiltersComponent', () => {
  let component: TasksFiltersComponent;
  let fixture: ComponentFixture<TasksFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TasksFiltersComponent],
    });

    fixture = TestBed.createComponent(TasksFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and emit clearFilters on clear button click', () => {
    const clearFiltersSpy = spyOn(component.clearFilters, 'emit');
    const button = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(clearFiltersSpy).toHaveBeenCalled();
  });
});
