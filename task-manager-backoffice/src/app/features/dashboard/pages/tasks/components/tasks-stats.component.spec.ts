import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksStatsComponent } from './tasks-stats.component';
import { TasksPagination } from '../interfaces/response';

describe('TasksStatsComponent', () => {
  let component: TasksStatsComponent;
  let fixture: ComponentFixture<TasksStatsComponent>;

  const mockPagination: TasksPagination = {
    content: [],
    totalElements: 42,
    totalPages: 5,
    size: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksStatsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tasks', mockPagination);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute totalCount accurately from tasks pagination input', () => {
    expect(component['totalCount']()).toBe(42);

    fixture.componentRef.setInput('tasks', undefined);
    fixture.detectChanges();
    expect(component['totalCount']()).toBe(0);
  });
});
