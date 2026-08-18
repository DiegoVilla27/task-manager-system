import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { SidebarComponent } from './components/sidebar.component';
import { TopbarComponent } from './components/topbar.component';

@Component({
  selector: 'app-backoffice-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './backoffice-layout.component.html',
  styleUrl: './backoffice-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackofficeLayoutComponent {
  // Visual state flags for layout interactivity (orchestrated at container level)
  readonly isSidebarCollapsed = signal<boolean>(false);
  readonly isUserMenuOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((v) => !v);
  }
}
