import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LightResult, LightState } from '../../domain/light.model';

@Injectable({
  providedIn: 'root',
})
export class LightService {
  private readonly url: string = `${environment.apiBaseUrl}/devices/`;
  private readonly http = inject(HttpClient);

  constructor() {}

  getState(deviceId: string) {
    return this.http.get<LightResult>(
      `${this.url}${encodeURIComponent(deviceId)}/light`
    );
  }

  setState(deviceId: string, state: LightState) {
    return this.http.put<LightResult>(
      `${this.url}${encodeURIComponent(deviceId)}/light`,
      { state },
    );
  }
}
