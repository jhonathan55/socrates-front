export type LightState = 'ON' | 'OFF';

export interface LightResult {
  deviceId: string;
  state: LightState;
  updatedAt?: string;
  checkedAt?: string;
}