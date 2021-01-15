import { TestBed } from '@angular/core/testing';

import { CariaService } from './caria.service';

describe('CariaService', () => {
  let service: CariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
