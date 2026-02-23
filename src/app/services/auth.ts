import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface UserDTO {
  userName: string;
  authorities: string[];
  token?: string;
}

interface JwtPayload {
  sub: string;
  authorities: string[];
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = this.decodeToken(token);
        // Si le token est présent mais vide de rôles, on nettoie immédiatement pour éviter les boucles
        if (!user.authorities || user.authorities.length === 0) {
          this.clearStorage();
        } else {
          this.currentUserSubject.next(user);
        }
      } catch {
        this.clearStorage();
      }
    }
  }

  login(credentials: Record<string, string>): Observable<UserDTO> {
    // Nettoyage préventif avant chaque tentative de connexion
    this.clearStorage();

    return this.http.post<UserDTO>(`${this.API_URL}/signin`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          const user = this.decodeToken(response.token);

          // Blocage si l'utilisateur n'a pas de rôles (cas fréquent des nouveaux comptes)
          if (!user.authorities || user.authorities.length === 0) {
            this.clearStorage();
            throw new Error("NO_ROLES");
          }

          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(user);
        }
      }),
      catchError((err) => {
        if (err.message === "NO_ROLES") {
          return throwError(() => ({
            status: 403,
            message: "Accès refusé : Aucun rôle n'est associé à ce compte."
          }));
        }
        return throwError(() => err);
      })
    );
  }

  private decodeToken(token: string): UserDTO {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      let roles = Array.isArray(decoded.authorities) ? decoded.authorities : [];

      // Normalisation : assure que tout est en MAJUSCULES et commence par ROLE_
      roles = roles.map((roleName: string) => {
      // 1. Mise en majuscules et suppression des espaces inutiles aux extrémités
      let formatted = roleName.trim().toUpperCase();

  // 2. REMPLACEMENT DES ESPACES PAR DES UNDERSCORES (Correction pour WAREHOUSE WORKER)
     formatted = formatted.replace(/\s+/g, '_');

  // 3. Ajout du préfixe ROLE_ si manquant
  return formatted.startsWith('ROLE_') ? formatted : `ROLE_${formatted}`;
    });

      return {
        userName: decoded.sub || '',
        authorities: roles,
        token: token
      };
    } catch {
      return { userName: '', authorities: [], token: '' };
    }
  }

  public get currentUserValue(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifie si l'utilisateur possède un rôle spécifique.
   * La comparaison est insensible à la casse.
   */
  hasRole(role: string): boolean {
    if (!this.currentUserValue) return false;
    const targetRole = role.toUpperCase().trim();
    return this.currentUserValue.authorities.some(a => a === targetRole);
  }

  public clearStorage(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  logout(): void {
    this.clearStorage();
    this.router.navigate(['/login']);
  }
}
