import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { StorageUtils } from '@shared/utils/storage.utils';
import { environment } from '@environments/environment';
import { UserMeResponse } from '../interfaces/response';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: UserMeResponse = {
    id: 'usr-100',
    name: 'Camila',
    lastname: 'Rodriguez',
    email: 'camila@taskmanager.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    StorageUtils.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user me profile, save to storage and update user$ signal', (done) => {
    service.me().subscribe((res) => {
      expect(res).toEqual(mockUser);
      expect(service.user$()).toEqual(mockUser);
      expect(StorageUtils.get('me')).toEqual(mockUser);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should save me to storage with saveMe', () => {
    service.saveMe(mockUser);
    expect(StorageUtils.get('me')).toEqual(mockUser);
  });
});
