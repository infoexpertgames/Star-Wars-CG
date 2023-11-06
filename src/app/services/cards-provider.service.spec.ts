import { TestBed } from '@angular/core/testing';

import { CardsProviderService } from './cards-provider.service';

describe('CardsProviderService', () => {
  let service: CardsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
