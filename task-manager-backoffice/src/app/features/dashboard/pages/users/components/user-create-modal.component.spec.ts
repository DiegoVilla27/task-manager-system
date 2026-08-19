import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { UserCreateModalComponent } from './user-create-modal.component';

describe('UserCreateModalComponent', () => {
  let component: UserCreateModalComponent;
  let fixture: ComponentFixture<UserCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(new QueryClient()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
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

  it('should not submit when form is invalid', async () => {
    component.form.get('name')?.setValue('');
    await component.handleSubmit();
    expect(component.form.invalid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailCtrl = component.form.get('email');
    emailCtrl?.setValue('invalid-email');
    expect(emailCtrl?.valid).toBeFalse();

    emailCtrl?.setValue('valid@example.com');
    expect(emailCtrl?.valid).toBeTrue();
  });
});
