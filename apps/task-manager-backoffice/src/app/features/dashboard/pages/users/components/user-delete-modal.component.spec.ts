import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDeleteModalComponent } from './user-delete-modal.component';
import { UserService } from '../services/user.service';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UserResponse } from '@task-manager-system/api-types';

describe('UserDeleteModalComponent', () => {
  let component: UserDeleteModalComponent;
  let fixture: ComponentFixture<UserDeleteModalComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser: UserResponse = {
    id: 'user-delete-1',
    name: 'DeleteMe',
    lastname: 'User',
    email: 'del@example.com',
    countTasks: 0,
    createdAt: '2026-08-20',
  };

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['deleteUser']);
    userServiceSpy.deleteUser.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      imports: [UserDeleteModalComponent],
      providers: [
        provideTanStackQuery(new QueryClient()),
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(UserDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and display user confirmation details', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close on handleClose', () => {
    const closeSpy = spyOn(component.close, 'emit');
    component.handleClose();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should call deleteUser and close on confirm', async () => {
    const closeSpy = spyOn(component.close, 'emit');
    await component.handleConfirm();

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith('user-delete-1');
    expect(closeSpy).toHaveBeenCalled();
  });
});
