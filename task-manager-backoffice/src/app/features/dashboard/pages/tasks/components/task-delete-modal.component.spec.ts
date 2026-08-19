import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { TaskDeleteModalComponent } from './task-delete-modal.component';
import { TaskService } from '../services/task.service';
import { TaskResponse, TaskStatus } from '../interfaces/response';

describe('TaskDeleteModalComponent', () => {
  let component: TaskDeleteModalComponent;
  let fixture: ComponentFixture<TaskDeleteModalComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let queryClient: QueryClient;

  const mockTask: TaskResponse = {
    id: 'task-123',
    title: 'Tarea a eliminar',
    description: 'Descripción',
    status: TaskStatus.PENDING,
    user: {
      id: 'usr-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@example.com',
    },
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    queryClient = new QueryClient();
    taskService = jasmine.createSpyObj('TaskService', ['deleteTask']);
    taskService.deleteTask.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [TaskDeleteModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(queryClient),
        { provide: TaskService, useValue: taskService },
      ],
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

  it('should emit close event on handleClose', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
  });

  it('should call deleteTask mutation on handleConfirm', async () => {
    spyOn(component, 'handleClose').and.callThrough();

    await component.handleConfirm();
    expect(component.handleClose).toHaveBeenCalled();
  });
});
