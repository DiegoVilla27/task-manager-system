import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    // Cleanup any lingering toast elements in body
    document.querySelectorAll('.fixed.bottom-6').forEach((el) => el.remove());
    document
      .querySelectorAll('.fixed.inset-0.z-50')
      .forEach((el) => el.remove());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display success toast and auto remove it after duration', fakeAsync(() => {
    service.success('Operación exitosa', 1000);
    tick(20);

    const toast = document.querySelector('.fixed.bottom-6');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Operación exitosa');

    tick(1500);
    expect(document.querySelector('.fixed.bottom-6')).toBeNull();
  }));

  it('should display error toast with list of field errors', fakeAsync(() => {
    service.error('Error de validación', [
      { field: 'email', value: '', message: 'El correo es requerido' },
      { field: 'password', value: '', message: 'La contraseña es muy corta' },
    ]);
    tick(20);

    const toast = document.querySelector('.fixed.bottom-6');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Error de validación');
    expect(toast?.textContent).toContain('Email: El correo es requerido');
    expect(toast?.textContent).toContain(
      'Password: La contraseña es muy corta',
    );
  }));

  it('should open confirm popup and resolve true when confirm button is clicked', fakeAsync(() => {
    let result: boolean | undefined;
    service.confirm('Eliminar', '¿Estás seguro?').then((res) => {
      result = res;
    });

    tick(20);
    const confirmBtn = document.querySelector(
      '#popup-confirm',
    ) as HTMLButtonElement;
    expect(confirmBtn).toBeTruthy();
    confirmBtn?.click();

    tick(350);
    expect(result).toBeTrue();
  }));

  it('should open confirm popup and resolve false when cancel button is clicked', fakeAsync(() => {
    let result: boolean | undefined;
    service.confirm('Eliminar', '¿Estás seguro?').then((res) => {
      result = res;
    });

    tick(20);
    const cancelBtn = document.querySelector(
      '#popup-cancel',
    ) as HTMLButtonElement;
    expect(cancelBtn).toBeTruthy();
    cancelBtn?.click();

    tick(350);
    expect(result).toBeFalse();
  }));
});
