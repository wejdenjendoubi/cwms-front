import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUserValue;

    // 1. Vérification de session
    if (!user || !user.authorities || user.authorities.length === 0) {
      this.authService.clearStorage();
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as string[] | undefined;

    // 2. Si la route est publique (pas de rôles requis)
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // 3. Vérification de l'accès (Comparaison robuste)
    const hasAccess = expectedRoles.some(expected =>
      user.authorities.some(possessed =>
        possessed.trim().toUpperCase() === expected.trim().toUpperCase()
      )
    );

    if (hasAccess) {
      return true;
    }

    // 4. Gestion des redirections en cas d'échec d'accès à une page spécifique
    console.error('ECHEC DE CORRESPONDANCE :', {
      attendu_par_la_route: expectedRoles,
      recu_du_backend: user.authorities
    });

    const isAdmin = this.authService.hasRole('ROLE_ADMIN');

    // On vérifie si l'utilisateur possède l'un des rôles "User" (incluant Viewer et Warehouse)
    const isStandardUser =
      this.authService.hasRole('ROLE_USER') ||
      this.authService.hasRole('ROLE_VIEWER') ||
      this.authService.hasRole('ROLE_WAREHOUSE_WORKER');

    if (isAdmin) {
      // Si c'est un admin, sa maison est dashboard-v1
      if (state.url !== '/dashboard-v1') {
        this.router.navigate(['/dashboard-v1']);
      }
    } else if (isStandardUser) {
      // Si c'est un Viewer, Worker ou User, sa maison est user-dashboard
      if (state.url !== '/user-dashboard') {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      // Si l'utilisateur a un rôle totalement inconnu, on déconnecte par sécurité
      console.warn("Rôle non reconnu. Déconnexion.");
      this.authService.logout();
    }

    return false;
  }
}
