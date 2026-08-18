import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksListComponent, TaskMock } from './tasks-list.component';

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
      initials: 'DV',
      avatarBg: 'from-indigo-600 to-cyan-500',
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
});
