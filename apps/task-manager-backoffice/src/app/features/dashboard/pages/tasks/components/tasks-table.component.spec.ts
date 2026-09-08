import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksTableComponent } from './tasks-table.component';
import { By } from '@angular/platform-browser';
import {
  PageTaskResponse,
  TaskResponse,
  TaskStatus,
} from '@task-manager-system/api-types';

describe('TasksTableComponent', () => {
  let component: TasksTableComponent;
  let fixture: ComponentFixture<TasksTableComponent>;

  const mockTask: TaskResponse = {
    id: 'task-123456',
    title: 'Nueva funcionalidad',
    description: 'Descripción de la tarea',
    status: TaskStatus.IN_PROGRESS,
    user: {
      id: 'user-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@taskmanager.com',
    },
    createdAt: '2026-08-20',
  };

  const mockTasksPagination: PageTaskResponse = {
    content: [mockTask],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TasksTableComponent],
    });

    fixture = TestBed.createComponent(TasksTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tasks', mockTasksPagination);
    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();
  });

  it('should create and render task row', () => {
    expect(component).toBeTruthy();
    const titleEl = fixture.debugElement.query(
      By.css('.font-semibold.text-white'),
    );
    expect(titleEl.nativeElement.textContent).toContain('Nueva funcionalidad');
  });

  it('should emit edit and delete outputs when action buttons are clicked', () => {
    const editSpy = spyOn(component.edit, 'emit');
    const deleteSpy = spyOn(component.delete, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('tbody button'));
    expect(buttons.length).toBe(2);

    buttons[0].nativeElement.click();
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(editSpy).toHaveBeenCalledWith(mockTask);
    expect(deleteSpy).toHaveBeenCalledWith(mockTask);
  });

  it('should render empty state message if no tasks found', () => {
    fixture.componentRef.setInput('tasks', {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    });
    fixture.detectChanges();

    const emptyCell = fixture.debugElement.query(By.css('td[colspan="6"]'));
    expect(emptyCell).toBeTruthy();
    expect(emptyCell.nativeElement.textContent).toContain(
      'No se encontraron tareas',
    );
  });
});
