import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { StorageService } from '@shared/services/storage.service';
import { environment } from '@environments/environment';
import {
  PageUserResponse,
  UserCreateRequest,
  UserMeResponse,
  UserResponse,
  UsersPaginationRequest,
  UserUpdateRequest,
} from '@task-manager-system/api-types';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockUserMe: UserMeResponse = {
    id: 'user-123',
    email: 'admin@taskmanager.com',
    name: 'Admin',
    lastname: 'User',
  };

  const mockUserResponse: UserResponse = {
    id: 'user-1',
    name: 'Diego',
    lastname: 'Villa',
    email: 'diego@taskmanager.com',
    countTasks: 5,
    createdAt: '2026-08-20',
  };

  const mockUsersPagination: PageUserResponse = {
    content: [mockUserResponse],
    totalElements: 1,
    totalPages: 1,
    size: 10,
  };

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'get',
      'set',
      'remove',
      'clear',
    ]);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch me profile, update signal, and save to storage', (done) => {
    service.me().subscribe((res) => {
      expect(res).toEqual(mockUserMe);
      expect(service.user$()).toEqual(mockUserMe);
      expect(storageServiceSpy.set).toHaveBeenCalledWith('me', mockUserMe);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserMe);
  });

  it('should fetch users with pagination and clean params', (done) => {
    const payload: UsersPaginationRequest = {
      page: 1,
      limit: 10,
      filters: {
        search: 'Diego',
      },
    };

    service.getUsers(payload).subscribe((res) => {
      expect(res).toEqual(mockUsersPagination);
      done();
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${environment.API_URL}/users` &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '10' &&
        request.params.get('search') === 'Diego',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUsersPagination);
  });

  it('should create user', (done) => {
    const payload: UserCreateRequest = {
      name: 'Diego',
      lastname: 'Villa',
      email: 'diego@taskmanager.com',
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

  it('should update user', (done) => {
    const payload: UserUpdateRequest = {
      name: 'Diego Updated',
    };

    service.updateUser('user-1', payload).subscribe((res) => {
      expect(res).toEqual(mockUserResponse);
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users/user-1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUserResponse);
  });

  it('should delete user', (done) => {
    service.deleteUser('user-1').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${environment.API_URL}/users/user-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
