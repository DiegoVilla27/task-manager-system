import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '@shared/services/toast.service';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['error']);

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

  it('should handle network/CORS error (status 0)', () => {
    httpClient.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.status).toBe(0);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.error(new ProgressEvent('error'), { status: 0 });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(
      'No se pudo conectar con el servidor (CORS o red).',
    );
  });

  it('should handle backend error with message and field errors', () => {
    const errorBody = {
      timestamp: '2026-08-20',
      status: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      errors: [{ field: 'email', value: '', message: 'Email inválido' }],
    };

    httpClient.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.status).toBe(400);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush(errorBody, { status: 400, statusText: 'Bad Request' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(
      'Validation failed',
      errorBody.errors,
    );
  });

  it('should handle backend error with only message', () => {
    const errorBody = {
      timestamp: '2026-08-20',
      status: 404,
      error: 'Not Found',
      message: 'Recurso no encontrado',
    };

    httpClient.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.status).toBe(404);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush(errorBody, { status: 404, statusText: 'Not Found' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Recurso no encontrado');
  });

  it('should handle unexpected fallback error', () => {
    httpClient.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(
      'Ha ocurrido un error inesperado.',
    );
  });
});
