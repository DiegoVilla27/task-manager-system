import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksStatsComponent } from './tasks-stats.component';
import { TasksPagination } from '../interfaces/response';

describe('TasksStatsComponent', () => {
  let component: TasksStatsComponent;
  let fixture: ComponentFixture<TasksStatsComponent>;

  const mockTasksPagination: TasksPagination = {
    content: [],
    totalElements: 42,
    totalPages: 5,
    size: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TasksStatsComponent],
    });

    fixture = TestBed.createComponent(TasksStatsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tasks', mockTasksPagination);
    fixture.detectChanges();
  });

  it('should create and calculate totalCount correctly', () => {
    expect(component).toBeTruthy();
    expect(component['totalCount']()).toBe(42);

    fixture.componentRef.setInput('tasks', undefined);
    fixture.detectChanges();
    expect(component['totalCount']()).toBe(0);
  });
});
