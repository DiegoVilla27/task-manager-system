import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginBrandComponent } from './components/login-brand.component';
import {
  LoginFormComponent,
  LoginFormValue,
} from './components/login-form.component';
import { LoginSsoComponent } from './components/login-sso.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    LoginBrandComponent,
    LoginFormComponent,
    LoginSsoComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  handleLoginSubmit(values: LoginFormValue): void {
    console.log('Login attempt:', values.email);
  }

  handleSsoSelect(provider: 'github' | 'okta'): void {
    console.log('SSO Provider selected:', provider);
  }
}
