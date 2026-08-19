import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { StorageUtils } from '@shared/utils/storage.utils';
import { environment } from '@environments/environment';
import {
  UserMeResponse,
  UserResponse,
  UsersPagination,
} from '../interfaces/response';
import {
  CreateUserRequest,
  EditUserRequest,
  UsersPaginationRequest,
} from '../interfaces/request';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUserMe: UserMeResponse = {
    id: 'usr-100',
    name: 'Camila',
    lastname: 'Rodriguez',
    email: 'camila@taskmanager.com',
  };

  const mockUserResponse: UserResponse = {
    id: 'usr-100',
    name: 'Camila',
    lastname: 'Rodriguez',
    email: 'camila@taskmanager.com',
    countTasks: 3,
    createdAt: '2026-01-01',
  };

  const mockPagination: UsersPagination = {
    content: [mockUserResponse],
    totalElements: 1,
    totalPages: 1,
    size: 10,
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
      expect(res).toEqual(mockUserMe);
      expect(service.user$()).toEqual(mockUserMe);
      expect(StorageUtils.get('me')).toEqual(mockUserMe);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserMe);
  });

  it('should get users pagination with cleanParams', (done) => {
    const payload: UsersPaginationRequest = {
      page: 1,
      limit: 10,
      search: 'Camila',
    };

    service.getUsers(payload).subscribe((res) => {
      expect(res).toEqual(mockPagination);
      done();
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${environment.API_URL}/users` &&
        r.params.get('page') === '1' &&
        r.params.get('limit') === '10' &&
        r.params.get('search') === 'Camila',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPagination);
  });

  it('should create a user', (done) => {
    const payload: CreateUserRequest = {
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    service.createUser(payload).subscribe((res) => {
      expect(res).toEqual(mockUserResponse);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUserResponse);
  });

  it('should update a user', (done) => {
    const payload: EditUserRequest = {
      name: 'Jane',
    };

    service.updateUser('usr-100', payload).subscribe((res) => {
      expect(res).toEqual(mockUserResponse);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users/usr-100`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUserResponse);
  });

  it('should delete a user', (done) => {
    service.deleteUser('usr-100').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users/usr-100`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should save me to storage with saveMe', () => {
    service.saveMe(mockUserMe);
    expect(StorageUtils.get('me')).toEqual(mockUserMe);
  });
});
