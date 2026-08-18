import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateModalComponent } from './user-create-modal.component';

describe('UserCreateModalComponent', () => {
  let component: UserCreateModalComponent;
  let fixture: ComponentFixture<UserCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
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

  it('should return correct name error messages', () => {
    const nameCtrl = component.form.get('name');
    expect(component['nameError']()).toBeNull();

    nameCtrl?.markAsTouched();
    nameCtrl?.setValue('');
    expect(component['nameError']()).toBe(
      'El nombre es obligatorio (mínimo 3 caracteres)',
    );

    nameCtrl?.setValue('Valeria');
    expect(component['nameError']()).toBeNull();
  });

  it('should return correct email error messages', () => {
    const emailCtrl = component.form.get('email');
    expect(component['emailError']()).toBeNull();

    emailCtrl?.markAsTouched();
    emailCtrl?.setValue('invalid');
    expect(component['emailError']()).toBe(
      'Ingresa un correo electrónico corporativo válido',
    );

    emailCtrl?.setValue('valeria@corp.com');
    expect(component['emailError']()).toBeNull();
  });

  it('should not emit created when form is invalid', () => {
    let created = false;
    component.created.subscribe(() => {
      created = true;
    });

    component.form.get('name')?.setValue('');
    component.handleSubmit();
    expect(created).toBeFalse();
  });

  it('should emit created with user data when form is valid', () => {
    let createdUser: unknown = null;
    component.created.subscribe((user) => {
      createdUser = user;
    });

    component.form.patchValue({
      name: 'Valeria Santana',
      email: 'valeria@taskmanager.io',
      role: 'DEVELOPER',
      department: 'Frontend Engineering',
      status: 'ACTIVE',
    });

    component.handleSubmit();
    expect(createdUser).toEqual(
      jasmine.objectContaining({
        name: 'Valeria Santana',
        email: 'valeria@taskmanager.io',
      }),
    );
  });
});
