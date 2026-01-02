import { TestBed } from '@angular/core/testing';

import { Filho } from './filho';

describe('Filho', () => {
  let service: Filho;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Filho);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
