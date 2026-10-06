import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/theme/theme.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './app-toolbar.component.html',
  styleUrl: './app-toolbar.component.scss',
})
export class AppToolbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly currentUrl = signal(this.router.url);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAuthRoute = computed(() => {
    const current = this.currentUrl();
    return current.startsWith('/login') || current.startsWith('/register');
  });

  readonly authActionIcon = computed(() =>
    this.isAuthenticated() ? 'logout' : this.isAuthRoute() ? 'person_add' : 'login'
  );

  readonly authActionLabel = computed(() =>
    this.isAuthenticated()
      ? 'Cerrar sesion'
      : this.isAuthRoute()
        ? 'Crear cuenta'
        : 'Iniciar sesion'
  );

  readonly currentThemeIcon = computed(() =>
    this.themeService.isDark() ? 'light_mode' : 'dark_mode'
  );

  readonly currentThemeLabel = computed(() =>
    this.themeService.isDark() ? 'Usar tema claro' : 'Usar tema oscuro'
  );

  readonly themeAriaLabel = computed(() =>
    this.themeService.isDark() ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  runAuthAction(): void {
    if (this.isAuthenticated()) {
      this.logout();
      return;
    }

    if (this.isAuthRoute()) {
      void this.router.navigate(['/register']);
      return;
    }

    void this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.currentUrl.set(this.router.url));
  }
}
