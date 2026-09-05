import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { PLATFORM_ID } from '@angular/core';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    document.querySelectorAll('.fixed.bottom-6').forEach((el) => el.remove());
    document.querySelectorAll('.fixed.inset-0').forEach((el) => el.remove());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should render success toast with message in DOM and remove it after duration', fakeAsync(() => {
    service.success('Operación exitosa', 1000);
    tick(10);

    const toast = document.querySelector('.fixed.bottom-6');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Operación exitosa');

    tick(1350);
    expect(document.querySelector('.fixed.bottom-6')).toBeNull();
  }));

  it('should render error toast with error list', fakeAsync(() => {
    service.error(
      'Error de validación',
      [{ field: 'email', value: '', message: 'El correo es inválido' }],
      1000,
    );
    tick(10);

    const toast = document.querySelector('.fixed.bottom-6');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Error de validación');
    expect(toast?.textContent).toContain('Email: El correo es inválido');

    tick(1350);
  }));

  it('should resolve confirm dialog with true when clicking confirm', fakeAsync(() => {
    let result: boolean | null = null;
    service.confirm('Confirmar acción', '¿Deseas continuar?').then((res) => {
      result = res;
    });
    tick(20);

    const confirmBtn = document.getElementById(
      'popup-confirm',
    ) as HTMLButtonElement;
    expect(confirmBtn).toBeTruthy();
    confirmBtn.click();
    tick(350);

    expect(result).toBeTrue();
  }));

  it('should resolve confirm dialog with false when clicking cancel', fakeAsync(() => {
    let result: boolean | null = null;
    service.confirm('Cancelar acción', '¿Deseas cancelar?').then((res) => {
      result = res;
    });
    tick(20);

    const cancelBtn = document.getElementById(
      'popup-cancel',
    ) as HTMLButtonElement;
    expect(cancelBtn).toBeTruthy();
    cancelBtn.click();
    tick(350);

    expect(result).toBeFalse();
  }));
});
