import { Injectable, computed, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'themeMode';
  private readonly currentThemeSignal = signal<ThemeMode>('light');

  readonly currentTheme = this.currentThemeSignal.asReadonly();
  readonly isDark = computed(() => this.currentThemeSignal() === 'dark');

  constructor() {
    this.initializeTheme();
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.currentThemeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  private initializeTheme(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(this.storageKey);
    if (stored === 'light' || stored === 'dark') {
      this.setTheme(stored, false);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light', false);
  }

  private setTheme(mode: ThemeMode, persist = true): void {
    this.currentThemeSignal.set(mode);

    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-theme', mode === 'dark');
      document.body.style.colorScheme = mode;
    }

    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, mode);
    }
  }
}
