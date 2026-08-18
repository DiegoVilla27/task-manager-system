import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { errorInterceptor, ApiErrorResponse } from './error.interceptor';
import { ToastService } from '@shared/services/toast.service';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', [
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle status 0 network / CORS errors', () => {
    httpClient.get('/api/test').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(0);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.error(new ProgressEvent('error'), { status: 0 });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(
      'No se pudo conectar con el servidor (CORS o red).',
    );
  });

  it('should handle API errors with message and field errors list', () => {
    const errorBody: ApiErrorResponse = {
      timestamp: '2026-08-18T10:00:00Z',
      status: 400,
      error: 'Bad Request',
      message: 'Error de validación',
      errors: [{ field: 'email', value: '', message: 'Email requerido' }],
    };

    httpClient.get('/api/test').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(400);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush(errorBody, { status: 400, statusText: 'Bad Request' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(
      'Error de validación',
      errorBody.errors,
    );
  });

  it('should handle API errors with message only', () => {
    const errorBody: ApiErrorResponse = {
      timestamp: '2026-08-18T10:00:00Z',
      status: 404,
      error: 'Not Found',
      message: 'Recurso no encontrado',
    };

    httpClient.get('/api/test').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(404);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush(errorBody, { status: 404, statusText: 'Not Found' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Recurso no encontrado');
  });

  it('should handle unknown errors with generic message', () => {
    httpClient.get('/api/test').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Server error string', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(
      'Ha ocurrido un error inesperado.',
    );
  });
});
