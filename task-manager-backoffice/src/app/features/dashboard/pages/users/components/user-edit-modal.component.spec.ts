import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { UserEditModalComponent } from './user-edit-modal.component';
import { UserResponse } from '../interfaces/response';

describe('UserEditModalComponent', () => {
  let component: UserEditModalComponent;
  let fixture: ComponentFixture<UserEditModalComponent>;

  const mockUser: UserResponse = {
    id: 'usr-1',
    name: 'Camila',
    lastname: 'Rodriguez',
    email: 'camila.rodriguez@company.com',
    countTasks: 14,
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(new QueryClient()),
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
  });
});
