import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';
import { UserEditModalComponent } from './user-edit-modal.component';
import { UserService } from '../services/user.service';
import { UserResponse } from '../interfaces/response';

describe('UserEditModalComponent', () => {
  let component: UserEditModalComponent;
  let fixture: ComponentFixture<UserEditModalComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let queryClient: QueryClient;

  const mockUser: UserResponse = {
    id: 'usr-1',
    name: 'Camila',
    lastname: 'Rodriguez',
    email: 'camila.rodriguez@company.com',
    countTasks: 14,
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    queryClient = new QueryClient();
    userService = jasmine.createSpyObj('UserService', ['updateUser']);
    userService.updateUser.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [UserEditModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(queryClient),
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with user data', () => {
    expect(component.form.value.name).toBe('Camila');
    expect(component.form.value.lastname).toBe('Rodriguez');
    expect(component.form.value.email).toBe('camila.rodriguez@company.com');
  });

  it('should emit close event on handleClose', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
    expect(component.form.value.name).toBe('');
  });

  it('should not submit if form is invalid or user is null', async () => {
    fixture.componentRef.setInput('user', null);
    fixture.detectChanges();

    await component.handleSubmit();
    expect(userService.updateUser).not.toHaveBeenCalled();

    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
    component.form.get('name')?.setValue('a'); // minLength 3 -> invalid

    await component.handleSubmit();
    expect(component.form.invalid).toBeTrue();
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('should submit valid form and trigger editUserMutation', async () => {
    spyOn(component, 'handleClose').and.callThrough();

    component.form.patchValue({
      name: 'Camila Updated',
      lastname: 'Rodriguez Updated',
    });

    await component.handleSubmit();
    expect(component.handleClose).toHaveBeenCalled();
  });
});
