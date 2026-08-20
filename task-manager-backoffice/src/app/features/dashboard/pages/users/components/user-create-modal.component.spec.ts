import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateModalComponent } from './user-create-modal.component';
import { UserService } from '../services/user.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UserResponse } from '../interfaces/response';

describe('UserCreateModalComponent', () => {
  let component: UserCreateModalComponent;
  let fixture: ComponentFixture<UserCreateModalComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUserResponse: UserResponse = {
    id: 'user-1',
    name: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    countTasks: 0,
    createdAt: '2026-08-20',
  };

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['createUser']);
    userServiceSpy.createUser.and.returnValue(of(mockUserResponse));

    TestBed.configureTestingModule({
      imports: [UserCreateModalComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(UserCreateModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and validate invalid form initially', () => {
    expect(component).toBeTruthy();
    expect(component.form.invalid).toBeTrue();
  });

  it('should reset form and emit close on handleClose', () => {
    const closeSpy = spyOn(component.close, 'emit');
    component.form.setValue({
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    component.handleClose();

    expect(component.form.value.name).toBe('');
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', async () => {
    await component.handleSubmit();
    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
  });

  it('should submit valid form and call createUser', async () => {
    component.form.setValue({
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    await component.handleSubmit();

    expect(userServiceSpy.createUser).toHaveBeenCalledWith({
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });
  });
});
