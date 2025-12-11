import { TestBed } from '@angular/core/testing';

import { CartStorageService } from './cart-storage.service';

describe('CartStorageService', () => {
  let service: CartStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
