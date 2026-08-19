import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { TasksFiltersComponent } from './tasks-filters.component';
import { TaskStatus } from '../interfaces/response';

describe('TasksFiltersComponent', () => {
  let component: TasksFiltersComponent;
  let fixture: ComponentFixture<TasksFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange with debounce when search input changes', fakeAsync(() => {
    let emitted = '';
    component.searchChange.subscribe((val) => {
      emitted = val;
    });

    const searchInput = fixture.nativeElement.querySelector(
      'app-search-input input',
    );
    searchInput.value = 'Refactor';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emitted).toBe('');
    tick(400);
    expect(emitted).toBe('Refactor');
  }));

  it('should emit statusChange when select changes', () => {
    let statusEmitted = '';
    component.statusChange.subscribe((val) => {
      statusEmitted = val;
    });

    const select = fixture.nativeElement.querySelector('app-select select');
    select.value = TaskStatus.IN_PROGRESS;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(statusEmitted).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should emit clearFilters when clear button is clicked', () => {
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
