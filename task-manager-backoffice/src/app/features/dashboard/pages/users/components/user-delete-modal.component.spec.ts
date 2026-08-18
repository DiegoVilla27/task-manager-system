import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDeleteModalComponent } from './user-delete-modal.component';
import { UserMock } from '../models/user.model';

describe('UserDeleteModalComponent', () => {
  let component: UserDeleteModalComponent;
  let fixture: ComponentFixture<UserDeleteModalComponent>;

  const mockUser: UserMock = {
    id: 'usr-999',
    name: 'Usuario a Revocar',
    email: 'revocar@taskmanager.io',
    role: 'VIEWER',
    status: 'INACTIVE',
    department: 'QA',
    assignedTasks: 0,
    lastLogin: 'Ayer',
    avatarBg: 'from-slate-600 to-slate-700',
    initials: 'UR',
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeleteModalComponent],
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

  it('should emit closed event on handleClose', () => {
    let closed = false;
    component.closed.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
  });

  it('should emit confirmed event with user ID on handleConfirm', () => {
    let confirmedId = '';
    component.confirmed.subscribe((id) => {
      confirmedId = id;
    });

    component.handleConfirm();
    expect(confirmedId).toBe('usr-999');
  });
});
