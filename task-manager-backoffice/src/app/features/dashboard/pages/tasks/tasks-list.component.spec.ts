import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksListComponent } from './tasks-list.component';
import { TaskMock } from './models/task.model';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;

  const mockTask: TaskMock = {
    id: 'TSK-TEST-01',
    code: 'TM-999',
    title: 'Test Task Title',
    description: 'Test Task Description',
    status: 'TODO',
    assignee: {
      name: 'Diego Villa',
      avatarBg: 'from-indigo-600 to-cyan-500',
      initials: 'DV',
    },
    dueDate: '2026-03-01',
    progress: 50,
    tags: ['Backend', 'API'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the tasks list component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial mock tasks', () => {
    expect(component.tasks().length).toBeGreaterThan(0);
  });

  it('should open and close create modal', () => {
    expect(component.isCreateModalOpen()).toBeFalse();
    component.openCreateModal();
    expect(component.isCreateModalOpen()).toBeTrue();
    component.closeCreateModal();
    expect(component.isCreateModalOpen()).toBeFalse();
  });

  it('should open and close edit modal', () => {
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();

    component.openEditModal(mockTask);
    expect(component.isEditModalOpen()).toBeTrue();
    expect(component.selectedTask()).toEqual(mockTask);

    component.closeEditModal();
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();
  });

  it('should open and close delete modal', () => {
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();

    component.openDeleteModal(mockTask);
    expect(component.isDeleteModalOpen()).toBeTrue();
    expect(component.selectedTask()).toEqual(mockTask);

    component.closeDeleteModal();
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();
  });

  it('should handle creating a new task', () => {
    const initialCount = component.tasks().length;
    component.openCreateModal();
    component.handleCreateTask({
      title: 'Nueva Tarea Creada',
      description: 'Detalle de prueba',
      status: 'TODO',
      assignee: {
        name: 'Sofia Hernandez',
        initials: 'SH',
        avatarBg: 'from-purple-600 to-pink-500',
      },
      dueDate: '10 Mar 2026',
      tags: ['Frontend'],
    });

    expect(component.tasks().length).toBe(initialCount + 1);
    expect(component.tasks()[0].title).toBe('Nueva Tarea Creada');
    expect(component.isCreateModalOpen()).toBeFalse();
  });

  it('should handle saving an edited task', () => {
    const taskToEdit = component.tasks()[0];
    component.openEditModal(taskToEdit);

    const updated: TaskMock = {
      ...taskToEdit,
      title: 'Título Modificado Test',
      progress: 99,
    };

    component.handleSaveTask(updated);
    expect(component.tasks()[0].title).toBe('Título Modificado Test');
    expect(component.tasks()[0].progress).toBe(99);
    expect(component.isEditModalOpen()).toBeFalse();
  });

  it('should handle deleting a task', () => {
    const taskToDelete = component.tasks()[0];
    const initialCount = component.tasks().length;
    component.openDeleteModal(taskToDelete);

    component.handleDeleteTask(taskToDelete.id);
    expect(component.tasks().length).toBe(initialCount - 1);
    expect(
      component.tasks().find((t) => t.id === taskToDelete.id),
    ).toBeUndefined();
    expect(component.isDeleteModalOpen()).toBeFalse();
  });

  it('should filter tasks by search query', () => {
    component.handleSearchChange('Signals');
    const filtered = component.filteredTasks();
    expect(
      filtered.every(
        (t) =>
          t.title.toLowerCase().includes('signals') ||
          t.description.toLowerCase().includes('signals'),
      ),
    ).toBeTrue();
  });

  it('should filter tasks by status', () => {
    component.handleStatusChange('COMPLETED');
    const filtered = component.filteredTasks();
    expect(filtered.every((t) => t.status === 'COMPLETED')).toBeTrue();
  });

  it('should clear all filters', () => {
    component.handleSearchChange('Something');
    component.handleStatusChange('TODO');
    expect(component.searchQuery()).toBe('Something');
    expect(component.statusFilter()).toBe('TODO');

    component.handleClearFilters();
    expect(component.searchQuery()).toBe('');
    expect(component.statusFilter()).toBe('');
  });

  it('should change page on handlePageChange', () => {
    component.handlePageChange(2);
    expect(component.currentPage()).toBe(2);
  });
});
