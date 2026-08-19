import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksTableComponent } from './tasks-table.component';
import {
  TaskResponse,
  TasksPagination,
  TaskStatus,
} from '../interfaces/response';

describe('TasksTableComponent', () => {
  let component: TasksTableComponent;
  let fixture: ComponentFixture<TasksTableComponent>;

  const mockTask1: TaskResponse = {
    id: 'tsk-11111-uuid',
    title: 'Tarea Pendiente',
    description: 'Descripción 1',
    status: TaskStatus.PENDING,
    user: {
      id: 'usr-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@example.com',
    },
    createdAt: '2026-01-01',
  };

  const mockTask2: TaskResponse = {
    id: 'tsk-22222-uuid',
    title: 'Tarea En Progreso',
    description: 'Descripción 2',
    status: TaskStatus.IN_PROGRESS,
    user: {
      id: 'usr-2',
      name: 'Camila',
      lastname: 'Rodriguez',
      email: 'camila@example.com',
    },
    createdAt: '2026-01-02',
  };

  const mockTask3: TaskResponse = {
    id: 'tsk-33333-uuid',
    title: 'Tarea Completada',
    description: 'Descripción 3',
    status: TaskStatus.COMPLETED,
    user: {
      id: 'usr-3',
      name: 'Alejandro',
      lastname: 'Morales',
      email: 'alejandro@example.com',
    },
    createdAt: '2026-01-03',
  };

  const mockPagination: TasksPagination = {
    content: [mockTask1, mockTask2, mockTask3],
    totalElements: 3,
    totalPages: 1,
    size: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tasks', mockPagination);
    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit event when edit button is clicked', () => {
    let editedTask: TaskResponse | undefined;
    component.edit.subscribe((t) => {
      editedTask = t;
    });

    const editBtn = fixture.nativeElement.querySelector(
      'button[aria-label^="Editar"]',
    );
    editBtn.click();
    fixture.detectChanges();

    expect(editedTask).toEqual(mockTask1);
  });

  it('should emit delete event when delete button is clicked', () => {
    let deletedTask: TaskResponse | undefined;
    component.delete.subscribe((t) => {
      deletedTask = t;
    });

    const deleteBtn = fixture.nativeElement.querySelector(
      'button[aria-label^="Eliminar"]',
    );
    deleteBtn.click();
    fixture.detectChanges();

    expect(deletedTask).toEqual(mockTask1);
  });

  it('should render empty state when tasks list is empty', () => {
    fixture.componentRef.setInput('tasks', {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
    });
    fixture.detectChanges();

    const emptyTd = fixture.nativeElement.querySelector('td.text-center');
    expect(emptyTd.textContent).toContain(
      'No se encontraron tareas registradas',
    );
  });
});
