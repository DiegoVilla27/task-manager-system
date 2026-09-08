import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { cleanParams } from '@shared/utils/clean-params.utils';
import {
  PageTaskResponse,
  TaskCreateRequest,
  TaskResponse,
  TasksPaginationRequest,
  TaskUpdateRequest,
} from '@task-manager-system/api-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly BASE_TASKS = `${environment.API_URL}/tasks`;
  private readonly http = inject(HttpClient);

  public getTasks(
    payload: TasksPaginationRequest,
  ): Observable<PageTaskResponse> {
    const params = cleanParams(payload);
    return this.http.get<PageTaskResponse>(this.BASE_TASKS, { params });
  }

  public createTask(payload: TaskCreateRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.BASE_TASKS, payload);
  }

  public updateTask(
    taskId: string,
    payload: TaskUpdateRequest,
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
