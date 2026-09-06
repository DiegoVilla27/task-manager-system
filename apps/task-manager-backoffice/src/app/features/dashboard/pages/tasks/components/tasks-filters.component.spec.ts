import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { TasksFiltersComponent } from './tasks-filters.component';
import { TaskStatus } from '@task-manager-system/api-types';

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

  it('should emit searchChange when search input emits', fakeAsync(() => {
    const searchSpy = spyOn(component.searchChange, 'emit');
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'Refactor';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(400);

    expect(searchSpy).toHaveBeenCalledWith('Refactor');
  }));

  it('should emit statusChange when status select emits', () => {
    const statusSpy = spyOn(component.statusChange, 'emit');
    const select = fixture.nativeElement.querySelector('select');
    select.value = TaskStatus.IN_PROGRESS;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(statusSpy).toHaveBeenCalledWith(TaskStatus.IN_PROGRESS);
  });
});
