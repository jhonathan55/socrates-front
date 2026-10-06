/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LightService } from './light.service';

describe('Service: Light', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LightService]
    });
  });

  it('should ...', inject([LightService], (service: LightService) => {
    expect(service).toBeTruthy();
  }));
});
