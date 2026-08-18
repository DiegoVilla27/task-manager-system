import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskEditModalComponent } from './task-edit-modal.component';
import { TaskMock } from '../models/task.model';

describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;

  const mockTask: TaskMock = {
    id: 'task-1',
    code: 'TSK-101',
    title: 'Migración a Signals',
    description: 'Refactorizar componentes a Signals',
    status: 'IN_PROGRESS',
    progress: 75,
    dueDate: '25 Feb 2026',
    assignee: {
      name: 'Diego Villa',
      initials: 'DV',
      avatarBg: 'from-indigo-600 to-cyan-500',
    },
    tags: ['Frontend', 'Angular'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with task data', () => {
    expect(component.form.value.title).toBe('Migración a Signals');
    expect(component.form.value.status).toBe('IN_PROGRESS');
    expect(component.form.value.progress).toBe(75);
  });

  it('should emit closed event on handleClose', () => {
    let closed = false;
    component.closed.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
  });

  it('should return correct title error messages', () => {
    const titleCtrl = component.form.get('title');
    expect(component['titleError']()).toBeNull();

    titleCtrl?.markAsTouched();
    titleCtrl?.setValue('');
    expect(component['titleError']()).toBe('El título es obligatorio');

    titleCtrl?.setValue('Valid Title');
    expect(component['titleError']()).toBeNull();
  });

  it('should not emit saved when form is invalid', () => {
    let saved = false;
    component.saved.subscribe(() => {
      saved = true;
    });

    component.form.get('title')?.setValue('');
    component.handleSubmit();
    expect(saved).toBeFalse();
  });

  it('should emit saved event with updated task on valid submit', () => {
    let savedTask: TaskMock | undefined;
    component.saved.subscribe((task: TaskMock) => {
      savedTask = task;
    });

    component.form.patchValue({
      title: 'Migración a Signals V2',
      progress: 90,
    });

    component.handleSubmit();
    expect(savedTask).toBeDefined();
    expect(savedTask?.title).toBe('Migración a Signals V2');
    expect(savedTask?.progress).toBe(90);
  });
});
