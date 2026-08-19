import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { UserDeleteModalComponent } from './user-delete-modal.component';
import { UserResponse } from '../interfaces/response';

describe('UserDeleteModalComponent', () => {
  let component: UserDeleteModalComponent;
  let fixture: ComponentFixture<UserDeleteModalComponent>;

  const mockUser: UserResponse = {
    id: 'usr-999',
    name: 'Usuario',
    lastname: 'Prueba',
    email: 'revocar@taskmanager.io',
    countTasks: 0,
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeleteModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(new QueryClient()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event on handleClose', () => {
    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
  });
});
