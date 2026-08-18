import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditModalComponent } from './user-edit-modal.component';
import { UserMock } from '../models/user.model';

describe('UserEditModalComponent', () => {
  let component: UserEditModalComponent;
  let fixture: ComponentFixture<UserEditModalComponent>;

  const mockUser: UserMock = {
    id: 'usr-1',
    name: 'Camila Rodriguez',
    email: 'camila.rodriguez@company.com',
    role: 'MANAGER',
    status: 'ACTIVE',
    department: 'Product & Design',
    assignedTasks: 14,
    lastLogin: 'Hace 5 min',
    avatarBg: 'from-purple-600 to-pink-500',
    initials: 'CR',
    createdAt: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditModalComponent],
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
    expect(component.form.value.name).toBe('Camila Rodriguez');
    expect(component.form.value.role).toBe('MANAGER');
    expect(component.form.value.department).toBe('Product & Design');
  });

  it('should emit closed event on handleClose', () => {
    let closed = false;
    component.closed.subscribe(() => {
      closed = true;
    });

    component.handleClose();
    expect(closed).toBeTrue();
  });

  it('should return correct name error messages', () => {
    const nameCtrl = component.form.get('name');
    expect(component['nameError']()).toBeNull();

    nameCtrl?.markAsTouched();
    nameCtrl?.setValue('');
    expect(component['nameError']()).toBe('El nombre es obligatorio');

    nameCtrl?.setValue('Camila');
    expect(component['nameError']()).toBeNull();
  });

  it('should return correct email error messages', () => {
    const emailCtrl = component.form.get('email');
    expect(component['emailError']()).toBeNull();

    emailCtrl?.markAsTouched();
    emailCtrl?.setValue('invalid');
    expect(component['emailError']()).toBe(
      'Ingresa un correo electrónico válido',
    );

    emailCtrl?.setValue('valid@company.com');
    expect(component['emailError']()).toBeNull();
  });

  it('should not emit saved when form is invalid', () => {
    let saved = false;
    component.saved.subscribe(() => {
      saved = true;
    });

    component.form.get('name')?.setValue('');
    component.handleSubmit();
    expect(saved).toBeFalse();
  });

  it('should emit saved event with updated user on valid submit', () => {
    let savedUser: UserMock | undefined;
    component.saved.subscribe((user: UserMock) => {
      savedUser = user;
    });

    component.form.patchValue({
      name: 'Camila Rodriguez Morales',
      role: 'ADMIN',
    });

    component.handleSubmit();
    expect(savedUser).toBeDefined();
    expect(savedUser?.name).toBe('Camila Rodriguez Morales');
    expect(savedUser?.role).toBe('ADMIN');
  });
});
