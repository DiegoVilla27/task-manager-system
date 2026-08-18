import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDeleteModalComponent } from './task-delete-modal.component';
import { TaskMock } from '../models/task.model';

describe('TaskDeleteModalComponent', () => {
  let component: TaskDeleteModalComponent;
  let fixture: ComponentFixture<TaskDeleteModalComponent>;

  const mockTask: TaskMock = {
    id: 'task-123',
    code: 'TSK-123',
    title: 'Tarea a eliminar',
    description: 'Descripción',
    status: 'TODO',
    progress: 0,
    dueDate: '28 Feb 2026',
    assignee: {
      name: 'Diego Villa',
      initials: 'DV',
      avatarBg: 'from-indigo-600 to-cyan-500',
    },
    tags: ['Test'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDeleteModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed event on handleClose', () => {
    let closed = false;
    component.closed.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
  });

  it('should emit confirmed event with task ID on handleConfirm', () => {
    let confirmedId = '';
    component.confirmed.subscribe((id) => {
      confirmedId = id;
    });

    component.handleConfirm();
    expect(confirmedId).toBe('task-123');
  });
});
