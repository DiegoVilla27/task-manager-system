import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditModalComponent } from './user-edit-modal.component';
import { UserService } from '../services/user.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UserResponse } from '@task-manager-system/api-types';

describe('UserEditModalComponent', () => {
  let component: UserEditModalComponent;
  let fixture: ComponentFixture<UserEditModalComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser: UserResponse = {
    id: 'user-123',
    name: 'Jane',
    lastname: 'Doe',
    email: 'jane@example.com',
    countTasks: 2,
    createdAt: '2026-08-20',
  };

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['updateUser']);
    userServiceSpy.updateUser.and.returnValue(of(mockUser));

    TestBed.configureTestingModule({
      imports: [UserEditModalComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(UserEditModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and patch user values in form', () => {
    expect(component).toBeTruthy();
    expect(component.form.value.name).toBe('Jane');
    expect(component.form.value.lastname).toBe('Doe');
    expect(component.form.value.email).toBe('jane@example.com');
  });

  it('should reset form and emit close on handleClose', () => {
    const closeSpy = spyOn(component.close, 'emit');
    component.handleClose();

    expect(component.form.value.name).toBe('');
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should update user on valid submit', async () => {
    component.form.patchValue({
      name: 'Jane Updated',
    });

    await component.handleSubmit();

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(
      'user-123',
      jasmine.objectContaining({
        name: 'Jane Updated',
      }),
    );
  });
});
