import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-backoffice-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './backoffice-layout.component.html',
  styleUrl: './backoffice-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackofficeLayoutComponent {
  // Visual state flags for layout interactivity (pure UI)
  readonly isSidebarCollapsed = signal<boolean>(false);
  readonly isUserMenuOpen = signal<boolean>(false);
  readonly isNotificationsOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((v) => !v);
  }

  toggleNotifications(): void {
    this.isNotificationsOpen.update((v) => !v);
  }
}
