import { TestBed } from '@angular/core/testing';

import { PrioridadService } from './prioridadService';

describe('PrioridadService', () => {
  let service: PrioridadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrioridadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
