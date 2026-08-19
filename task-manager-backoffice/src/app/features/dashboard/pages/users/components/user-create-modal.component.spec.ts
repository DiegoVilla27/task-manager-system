import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UserCreateModalComponent } from './user-create-modal.component';
import { UserService } from '../services/user.service';
import { UserResponse } from '../interfaces/response';

describe('UserCreateModalComponent', () => {
  let component: UserCreateModalComponent;
  let fixture: ComponentFixture<UserCreateModalComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let queryClient: QueryClient;

  const mockCreatedUser: UserResponse = {
    id: 'usr-123',
    name: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    countTasks: 0,
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    queryClient = new QueryClient();
    userService = jasmine.createSpyObj('UserService', ['createUser']);
    userService.createUser.and.returnValue(of(mockCreatedUser));

    await TestBed.configureTestingModule({
      imports: [UserCreateModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(queryClient),
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event and reset form on handleClose', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component.form.patchValue({
      name: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'password123',
    });

    component.handleClose();
    expect(closed).toBeTrue();
    expect(component.form.value.name).toBe('');
  });

  it('should mark all fields as touched and not submit when form is invalid', async () => {
    component.form.reset({
      name: '',
      lastname: '',
      email: '',
      password: '',
    });

    await component.handleSubmit();
    expect(component.form.invalid).toBeTrue();
    expect(component.form.get('name')?.touched).toBeTrue();
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('should submit valid form and trigger mutation', async () => {
    spyOn(component, 'handleClose').and.callThrough();

    component.form.setValue({
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'strongPassword123',
    });

    await component.handleSubmit();
    expect(component.handleClose).toHaveBeenCalled();
  });
});
