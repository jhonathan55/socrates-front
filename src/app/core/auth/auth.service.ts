import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthRequest, AuthResponse, RegisterRequest } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly accessTokenSignal = signal<string | null>(null);
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.accessTokenSignal()));

  constructor() {
    this.restoreAccessToken();
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, request)
      .pipe(tap((response) => this.persistTokens(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, request)
      .pipe(tap((response) => this.persistTokens(response)));
  }

  logout(): void {
    this.accessTokenSignal.set(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('expiresIn');
    }
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  private persistTokens(response: AuthResponse): void {
    this.accessTokenSignal.set(response.accessToken);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('accessToken', response.accessToken);
      window.localStorage.setItem('refreshToken', response.refreshToken);
      window.localStorage.setItem('expiresIn', String(response.expiresIn));
    }
  }

  private restoreAccessToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const token = window.localStorage.getItem('accessToken');
    if (token) {
      this.accessTokenSignal.set(token);
    }
  }
}
