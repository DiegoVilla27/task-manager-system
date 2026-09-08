import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDeleteModalComponent } from './task-delete-modal.component';
import { TaskService } from '../services/task.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { TaskResponse, TaskStatus } from '@task-manager-system/api-types';

describe('TaskDeleteModalComponent', () => {
  let component: TaskDeleteModalComponent;
  let fixture: ComponentFixture<TaskDeleteModalComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const mockTask: TaskResponse = {
    id: 'task-del-1',
    title: 'Tarea a eliminar',
    description: 'Descripción',
    status: TaskStatus.PENDING,
    user: {
      id: 'user-1',
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@taskmanager.com',
    },
    createdAt: '2026-08-20',
  };

  beforeEach(() => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['deleteTask']);
    taskServiceSpy.deleteTask.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      imports: [TaskDeleteModalComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: TaskService, useValue: taskServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(TaskDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and display confirmation details', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close on handleClose', () => {
    const closeSpy = spyOn(component.close, 'emit');
    component.handleClose();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should call deleteTask and close on confirm', async () => {
    const closeSpy = spyOn(component.close, 'emit');
    await component.handleConfirm();

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('task-del-1');
    expect(closeSpy).toHaveBeenCalled();
  });
});
