import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreateModalComponent } from './task-create-modal.component';

describe('TaskCreateModalComponent', () => {
  let component: TaskCreateModalComponent;
  let fixture: ComponentFixture<TaskCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
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

  it('should return correct title error messages', () => {
    const titleCtrl = component.form.get('title');
    expect(component['titleError']()).toBeNull();

    titleCtrl?.markAsTouched();
    titleCtrl?.setValue('');
    expect(component['titleError']()).toBe(
      'El título es obligatorio (mínimo 3 caracteres)',
    );

    titleCtrl?.setValue('Valid Title');
    expect(component['titleError']()).toBeNull();
  });

  it('should return correct description error messages', () => {
    const descCtrl = component.form.get('description');
    expect(component['descError']()).toBeNull();

    descCtrl?.markAsTouched();
    descCtrl?.setValue('');
    expect(component['descError']()).toBe('La descripción es obligatoria');

    descCtrl?.setValue('Valid description');
    expect(component['descError']()).toBeNull();
  });

  it('should not emit created when form is invalid', () => {
    let created = false;
    component.created.subscribe(() => {
      created = true;
    });

    component.form.get('title')?.setValue('');
    component.handleSubmit();
    expect(created).toBeFalse();
  });

  it('should emit created with task data when form is valid', () => {
    let createdTask: unknown = null;
    component.created.subscribe((task) => {
      createdTask = task;
    });

    component.form.patchValue({
      title: 'Nueva Tarea Test',
      description: 'Descripción de prueba',
      status: 'TODO',
      dueDate: '01 Mar 2026',
      assignee: 'Diego Villa',
      tags: 'Backend, API',
    });

    component.handleSubmit();
    expect(createdTask).toEqual(
      jasmine.objectContaining({
        title: 'Nueva Tarea Test',
        description: 'Descripción de prueba',
      }),
    );
  });
});
