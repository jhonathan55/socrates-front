import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly hidePassword = signal(true);

  readonly roles = ['admin', 'viewer'];
  readonly departments = ['tecnologia', 'operaciones', 'seguridad'];

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
      ],
    ],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    role: ['admin', [Validators.required]],
    department: ['tecnologia', [Validators.required]],
  });

  togglePassword(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  showError(
    controlName: 'email' | 'password' | 'firstName' | 'lastName' | 'role' | 'department',
    errorName: string
  ): boolean {
    const control = this.form.controls[controlName];
    return Boolean(control.touched && control.hasError(errorName));
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Cuenta creada correctamente.', 'Cerrar', {
          duration: 3000,
        });
        void this.router.navigate(['/light']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('No se pudo completar el registro.');
        this.snackBar.open('No fue posible registrarte. Intenta nuevamente.', 'Cerrar', {
          duration: 4500,
        });
      },
    });
  }
}
