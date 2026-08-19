import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { TasksListComponent } from './tasks-list.component';
import {
  TaskResponse,
  TasksPagination,
  TaskStatus,
} from './interfaces/response';
import { TaskService } from './services/task.service';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTask: TaskResponse = {
    id: 'TSK-TEST-01',
    title: 'Test Task Title',
    description: 'Test Task Description',
    status: TaskStatus.PENDING,
    user: {
      id: 'usr-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@example.com',
    },
    createdAt: '2026-01-01',
  };

  const mockPagination: TasksPagination = {
    content: [mockTask],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(async () => {
    taskService = jasmine.createSpyObj('TaskService', ['getTasks']);
    taskService.getTasks.and.returnValue(of(mockPagination));

    await TestBed.configureTestingModule({
      imports: [TasksListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(new QueryClient()),
        { provide: TaskService, useValue: taskService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the tasks list component', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close create modal', () => {
    expect(component.isCreateModalOpen()).toBeFalse();
    component.isCreateModalOpen.set(true);
    expect(component.isCreateModalOpen()).toBeTrue();
    component.closeModal();
    expect(component.isCreateModalOpen()).toBeFalse();
  });

  it('should open and close edit modal', () => {
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();

    component.openEditModal(mockTask);
    expect(component.isEditModalOpen()).toBeTrue();
    expect(component.selectedTask()).toEqual(mockTask);

    component.closeModal();
    expect(component.isEditModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();
  });

  it('should open and close delete modal', () => {
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();

    component.openDeleteModal(mockTask);
    expect(component.isDeleteModalOpen()).toBeTrue();
    expect(component.selectedTask()).toEqual(mockTask);

    component.closeModal();
    expect(component.isDeleteModalOpen()).toBeFalse();
    expect(component.selectedTask()).toBeNull();
  });

  it('should clear all filters', () => {
    component.search.set('Search Query');
    component.status.set(TaskStatus.COMPLETED);
    expect(component.search()).toBe('Search Query');
    expect(component.status()).toBe(TaskStatus.COMPLETED);

    component.handleClearFilters();
    expect(component.search()).toBe('');
    expect(component.status()).toBe('');
  });
});
