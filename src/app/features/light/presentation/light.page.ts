import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LightService } from '../infrastructure/adapter/light.service';
import { LightState } from '../domain/light.model';

@Component({
  selector: 'app-light-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatSnackBarModule,
  ],
  templateUrl: './light.page.html',
  styleUrl: './light.page.scss',
})
export class LightPageComponent implements OnInit {
  private readonly lightService = inject(LightService);
  private readonly snackBar = inject(MatSnackBar);

  readonly deviceId = '001';
  readonly state = signal<LightState | null>(null);
  readonly lastUpdate = signal<string | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.lightService.getState(this.deviceId).subscribe({
      next: (response) => {
        this.state.set(response.state);
        this.lastUpdate.set(response.checkedAt ?? response.updatedAt ?? null);
        this.loading.set(false);
        this.snackBar.open('Estado actualizado.', 'Cerrar', { duration: 2200 });
      },
      error: () => {
        this.errorMessage.set('No se pudo consultar el estado de la luz.');
        this.loading.set(false);
      },
    });
  }

  setLightState(state: LightState): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.lightService.setState(this.deviceId, state).subscribe({
      next: (response) => {
        this.state.set(response.state);
        this.lastUpdate.set(response.updatedAt ?? response.checkedAt ?? null);
        this.loading.set(false);
        this.snackBar.open(`Luz ${response.state === 'ON' ? 'encendida' : 'apagada'}.`, 'Cerrar', {
          duration: 2500,
        });
      },
      error: () => {
        this.errorMessage.set('No se pudo actualizar el estado de la luz.');
        this.loading.set(false);
      },
    });
  }
}
