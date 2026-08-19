import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { cleanParams } from '@shared/utils/clean-params.utils';
import { Observable } from 'rxjs';
import {
  CreateTaskRequest,
  EditTaskRequest,
  TasksPaginationRequest,
} from '../interfaces/request';
import { TaskResponse, TasksPagination } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly BASE_TASKS = `${environment.API_URL}/tasks`;
  private readonly http = inject(HttpClient);

  public getTasks(
    payload: TasksPaginationRequest,
  ): Observable<TasksPagination> {
    const params = cleanParams(payload);
    return this.http.get<TasksPagination>(this.BASE_TASKS, { params });
  }

  public createTask(payload: CreateTaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.BASE_TASKS, payload);
  }

  public updateTask(
    taskId: string,
    payload: EditTaskRequest,
  ): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(
      `${this.BASE_TASKS}/${taskId}`,
      payload,
    );
  }

  public deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_TASKS}/${taskId}`);
  }
}
