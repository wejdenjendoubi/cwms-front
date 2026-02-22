import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUserValue;

    if (!user) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const expectedRoles = route.data['roles'] as string[] | undefined;

    // Si pas de rôles requis pour la page, on laisse passer
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // Vérification : l'utilisateur a-t-il au moins un des rôles requis ?
    const hasAccess = expectedRoles.some(role => this.authService.hasRole(role));

    if (hasAccess) {
      return true;
    }

    // Sinon, redirection vers le dashboard (accès refusé)
    console.error('Accès refusé : Rôle insuffisant. Requis:', expectedRoles, 'Possédés:', user.authorities);
    this.router.navigate(['/dashboard-v1']);
    return false;
  }
}
