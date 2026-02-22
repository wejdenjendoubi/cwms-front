import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

// Interfaces pour supprimer le "any"
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
        this.currentUserSubject.next(this.decodeToken(token));
      } catch {
        this.logout();
      }
    }
  }

  // Suppression du "any" ici (Correction image_2e1dca.png)
  login(credentials: Record<string, string>): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.API_URL}/signin`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          const user = this.decodeToken(response.token);

          // Blocage immédiat si l'utilisateur n'a pas de rôles en base
          if (!user.authorities || user.authorities.length === 0) {
            this.logout();
            throw new Error("Compte non autorisé : aucun rôle assigné.");
          }

          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(user);
        }
      }),
      catchError((err) => throwError(() => err))
    );
  }

  private decodeToken(token: string): UserDTO {
    // Utilisation de l'interface au lieu de any (Correction image_058af2.png)
    const decoded = jwtDecode<JwtPayload>(token);
    const roles = Array.isArray(decoded.authorities) ? decoded.authorities : [];

    return {
      userName: decoded.sub || '',
      authorities: roles,
      token: token
    };
  }

  public get currentUserValue(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return !!(this.currentUserValue?.authorities.includes(role));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
