import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // Visual state mockups
  readonly showPassword = signal<boolean>(false);
  readonly isRememberMeChecked = signal<boolean>(true);

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleRememberMe(): void {
    this.isRememberMeChecked.update((v) => !v);
  }
}
