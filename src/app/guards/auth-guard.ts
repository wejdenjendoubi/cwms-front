import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUserValue;

    if (user) {
      const expectedRoles = route.data['roles'] as string[] | undefined;

      if (!expectedRoles || expectedRoles.length === 0) {
        return true;
      }

      const hasAccess = expectedRoles.some(role => this.authService.hasRole(role));
      if (hasAccess) {
        return true;
      }

      this.router.navigate(['/dashboard-v1']);
      return false;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
