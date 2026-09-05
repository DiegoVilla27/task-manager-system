import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { StorageService } from '@shared/services/storage.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { LoginComponent } from './login.component';

describe('LoginComponent (Integration)', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let debug: DebugElement;
  let httpTesting: HttpTestingController;
  let storageService: StorageService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(
          new QueryClient({
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false },
            },
          }),
        ),
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService);
    storageService.clear(); // Limpiamos localStorage antes de cada prueba

    fixture = TestBed.createComponent(LoginComponent);
    debug = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify(); // Asegura que no queden llamadas HTTP pendientes
    storageService.clear();
  });

  it('should login successfully', async () => {
    // Obtenemos los elementos del DOM
    const emailInput = debug.query(By.css('#login-email'))
      .nativeElement as HTMLInputElement;
    const passwordInput = debug.query(By.css('#login-password'))
      .nativeElement as HTMLInputElement;
    const submit = debug.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;

    // Los seteamos
    emailInput.value = 'admin@taskmanager.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '12345678';
    passwordInput.dispatchEvent(new Event('input'));

    // Actualizamos cambios
    fixture.detectChanges();

    // Hacemos submit
    await submit.click();

    // Ejecutamos el servicio de login y emitimos un response fake con flush
    const loginReq = httpTesting.expectOne(`${environment.API_URL}/auth/login`);
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual({
      email: emailInput.value,
      password: passwordInput.value,
    });
    const tokens = {
      access_token: 'at_123',
      refresh_token: 'rt_23',
    };
    loginReq.flush(tokens);

    // Ejecutamos el servicio de me y emitimos un response fake con flush
    const meReq = httpTesting.expectOne(`${environment.API_URL}/users/me`);
    expect(meReq.request.method).toBe('GET');
    const meMock = {
      id: 'user-123',
      name: 'Diego',
      lastname: 'Villa',
      email: 'admin@taskmanager.com',
      role: 'ADMIN',
      createdAt: '2026-01-01',
    };
    meReq.flush(meMock);

    // Esperamos a que firstValueFrom/mutateAsync/onSuccess terminen
    await fixture.whenStable();

    // Afirmamos
    expect(storageService.get('access_token')).toEqual(tokens.access_token);
    expect(storageService.get('refresh_token')).toEqual(tokens.refresh_token);
    expect(storageService.get('me')).toEqual(meMock);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard/users');
  });
});
