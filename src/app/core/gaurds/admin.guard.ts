import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Yahan () lagana zaroori hai kyunke isLoggedIn signal hai
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.isAdmin()) {
    return true;
  }

  // Agar student hai to uske dashboard par bhejein
  router.navigate(['/student/dashboard']);
  return false;
};