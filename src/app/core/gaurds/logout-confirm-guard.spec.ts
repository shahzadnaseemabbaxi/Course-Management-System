import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { logoutConfirmGuard } from './logout-confirm-guard';

describe('logoutConfirmGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => logoutConfirmGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
