import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle login submit', () => {
    spyOn(console, 'log');
    component.handleLoginSubmit({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });
    expect(console.log).toHaveBeenCalledWith(
      'Login attempt:',
      'test@example.com',
    );
  });

  it('should handle SSO select', () => {
    spyOn(console, 'log');
    component.handleSsoSelect('github');
    expect(console.log).toHaveBeenCalledWith(
      'SSO Provider selected:',
      'github',
    );
  });
});
