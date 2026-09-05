import { ToastService } from '@shared/services/toast.service';
import { StorageService } from './storage.service';
import { TestBed } from '@angular/core/testing';

describe('StorageService', () => {
  let storageSvc: StorageService;
  let toastSvcMock: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    localStorage.clear();
    toastSvcMock = jasmine.createSpyObj('ToastService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: ToastService, useValue: toastSvcMock },
      ],
    });
    storageSvc = TestBed.inject(StorageService);
  });

  describe('set', () => {
    it('should set item string in local storage', () => {
      storageSvc.set('access_token', 'token_123');
      expect(localStorage.getItem('access_token')).toEqual('token_123');
    });

    it('should set item object in local storage', () => {
      const me = { id: 12, name: 'Diego' };
      storageSvc.set('me', me);
      expect(localStorage.getItem('me')).toEqual(JSON.stringify(me));
    });

    it('should reject set item in local storage', () => {
      spyOn(localStorage, 'setItem').and.throwError(
        new Error('QuotaExceededError'),
      );

      storageSvc.set('access_token', 'token_123');

      expect(toastSvcMock.error).toHaveBeenCalledTimes(1);
      expect(toastSvcMock.error).toHaveBeenCalledWith(
        `❌ Error serializando/guardando la llave [access_token] en LocalStorage: Error: QuotaExceededError`,
      );
    });
  });

  describe('get', () => {
    it('should get item to local storage', () => {
      localStorage.setItem('access_token', 'token_123');

      const access_token = storageSvc.get('access_token');

      expect(access_token).toBeDefined();
      expect(access_token).toEqual('token_123');
    });

    it('should get item null to local storage if doesnt exists', () => {
      const access_token = storageSvc.get('access_token');

      expect(access_token).toBeDefined();
      expect(access_token).toBeNull();
    });

    it('should reject get item to local storage', () => {
      spyOn(localStorage, 'getItem').and.throwError(new Error('Memory'));

      storageSvc.get('access_token');

      expect(toastSvcMock.error).toHaveBeenCalledTimes(1);
      expect(toastSvcMock.error).toHaveBeenCalledWith(
        `❌ Error leyendo/parseando la llave [access_token] desde LocalStorage: Error: Memory`,
      );
    });
  });

  it('should remove item in local storage', () => {
    const removeItemSpy = spyOn(localStorage, 'removeItem');
    storageSvc.remove('access_token');

    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith('access_token');
  });

  it('should verify if has item in local storage (true)', () => {
    const getItemSpy = spyOn(localStorage, 'getItem');

    const hasAccessToken = storageSvc.has('access_token');

    expect(!hasAccessToken).toBeFalse();
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith('access_token');
  });

  it('should verify if has item in local storage (false)', () => {
    localStorage.setItem('access_token', 'token_123');
    const getItemSpy = spyOn(localStorage, 'getItem');

    const hasAccessToken = storageSvc.has('access_token');

    expect(hasAccessToken).toBeTrue();
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith('access_token');
  });

  it('should clear all items in local storage', () => {
    localStorage.setItem('access_token', 'token_123');
    localStorage.setItem('refresh_token', 'token_456');
    const clearSpy = spyOn(localStorage, 'clear');

    storageSvc.clear();

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
