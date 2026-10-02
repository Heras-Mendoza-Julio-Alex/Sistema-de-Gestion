import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const userRole = payload.role;

  const Roles = route.data?.['roles'];

  if (Roles && !Roles.includes(userRole)) {
    sessionStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
